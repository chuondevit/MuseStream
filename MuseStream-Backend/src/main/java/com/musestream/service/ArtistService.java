package com.musestream.service;

import com.musestream.dto.ArtistResponse;
import com.musestream.dto.SongResponse;
import com.musestream.exception.ApiException;
import com.musestream.model.Artist;
import com.musestream.repository.ArtistRepository;
import com.musestream.repository.SongRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class ArtistService {

    private final ArtistRepository artistRepository;
    private final SongRepository songRepository;

    public ArtistService(ArtistRepository artistRepository, SongRepository songRepository) {
        this.artistRepository = artistRepository;
        this.songRepository = songRepository;
    }

    public List<ArtistResponse> list(String q) {
        List<Artist> artists = (q == null || q.isBlank())
                ? artistRepository.findAllByOrderByNameAsc()
                : artistRepository.findByNameContainingIgnoreCaseOrderByNameAsc(q.trim());
        return artists.stream().map(ArtistResponse::from).toList();
    }

    public ArtistResponse get(Long id) {
        return ArtistResponse.from(find(id));
    }

    public List<SongResponse> songs(Long artistId) {
        find(artistId);
        return songRepository.findByArtistIdOrderByPopularityDesc(artistId)
                .stream().map(SongResponse::from).toList();
    }

    /** Artists ranked by the total popularity of their songs. */
    public List<ArtistResponse> popular(int limit) {
        Map<Long, Long> score = new HashMap<>();
        for (Object[] row : songRepository.sumPopularityByArtist()) {
            score.put(((Number) row[0]).longValue(), ((Number) row[1]).longValue());
        }
        return artistRepository.findAll().stream()
                .sorted(Comparator
                        .comparingLong((Artist a) -> score.getOrDefault(a.getId(), 0L)).reversed()
                        .thenComparing(Artist::getName))
                .limit(Math.max(1, Math.min(limit, 50)))
                .map(ArtistResponse::from)
                .toList();
    }

    private Artist find(Long id) {
        return artistRepository.findById(id).orElseThrow(() -> ApiException.notFound("Artist not found: " + id));
    }
}
