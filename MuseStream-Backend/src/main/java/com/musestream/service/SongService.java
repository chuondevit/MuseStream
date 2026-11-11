package com.musestream.service;

import com.musestream.dto.PageResponse;
import com.musestream.dto.SongResponse;
import com.musestream.exception.ApiException;
import com.musestream.model.Song;
import com.musestream.repository.SongRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class SongService {

    static final Sort BY_POPULARITY = Sort.by(Sort.Order.desc("popularity"), Sort.Order.asc("id"));

    private final SongRepository songRepository;

    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    /** Clamps page/size to sane values so clients cannot request huge pages. */
    static Pageable pageable(int page, int size, Sort sort) {
        return PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100), sort);
    }

    public PageResponse<SongResponse> list(int page, int size, Long genreId, Long artistId) {
        Pageable pageable = pageable(page, size, BY_POPULARITY);
        Page<Song> result;
        if (artistId != null) {
            result = songRepository.findByArtistId(artistId, pageable);
        } else if (genreId != null) {
            result = songRepository.findByGenreId(genreId, pageable);
        } else {
            result = songRepository.findAll(pageable);
        }
        return PageResponse.from(result, SongResponse::from);
    }

    public SongResponse get(Long id) {
        return SongResponse.from(findSong(id));
    }

    public List<SongResponse> popular(int limit) {
        return songRepository.findAll(pageable(0, Math.min(limit, 50), BY_POPULARITY))
                .getContent().stream().map(SongResponse::from).toList();
    }

    public List<SongResponse> newReleases(int limit) {
        Sort sort = Sort.by(Sort.Order.desc("releaseDate").nullsLast(), Sort.Order.asc("id"));
        return songRepository.findAll(pageable(0, Math.min(limit, 50), sort))
                .getContent().stream().map(SongResponse::from).toList();
    }

    public PageResponse<SongResponse> search(String q, int page, int size) {
        if (q == null || q.isBlank()) {
            throw ApiException.badRequest("Query parameter 'q' is required");
        }
        // Escape LIKE wildcards so "100%" or "a_b" are searched literally.
        String escaped = q.trim().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
        return PageResponse.from(songRepository.search(escaped, pageable(page, size, BY_POPULARITY)),
                SongResponse::from);
    }

    Song findSong(Long id) {
        return songRepository.findById(id).orElseThrow(() -> ApiException.notFound("Song not found: " + id));
    }
}
