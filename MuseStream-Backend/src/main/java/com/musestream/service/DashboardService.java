package com.musestream.service;

import com.musestream.dto.DashboardResponse;
import com.musestream.dto.DashboardResponse.ArtistStat;
import com.musestream.dto.DashboardResponse.DayStat;
import com.musestream.dto.DashboardResponse.NamedCount;
import com.musestream.dto.DashboardResponse.SongStat;
import com.musestream.dto.SongResponse;
import com.musestream.model.Song;
import com.musestream.repository.ListeningHistoryRepository;
import com.musestream.repository.SongRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final ListeningHistoryRepository historyRepository;
    private final SongRepository songRepository;
    private final HistoryService historyService;

    public DashboardService(ListeningHistoryRepository historyRepository, SongRepository songRepository,
                            HistoryService historyService) {
        this.historyRepository = historyRepository;
        this.songRepository = songRepository;
        this.historyService = historyService;
    }

    public DashboardResponse build(Long userId) {
        long totalPlays = historyRepository.countByUserId(userId);
        long uniqueSongs = historyRepository.countDistinctSongs(userId);
        long seconds = historyRepository.totalListeningSeconds(userId);

        List<NamedCount> genres = historyRepository.topGenres(userId, PageRequest.of(0, 5)).stream()
                .map(r -> new NamedCount(((Number) r[0]).longValue(), (String) r[1], ((Number) r[2]).longValue()))
                .toList();

        List<ArtistStat> artists = historyRepository.topArtists(userId, PageRequest.of(0, 5)).stream()
                .map(r -> new ArtistStat(((Number) r[0]).longValue(), (String) r[1], (String) r[2],
                        ((Number) r[3]).longValue()))
                .toList();

        List<Object[]> topSongRows = historyRepository.topSongs(userId, PageRequest.of(0, 5));
        List<Long> topSongIds = topSongRows.stream().map(r -> ((Number) r[0]).longValue()).toList();
        Map<Long, Song> songsById = new HashMap<>();
        songRepository.findAllById(topSongIds).forEach(s -> songsById.put(s.getId(), s));
        List<SongStat> topSongs = topSongRows.stream()
                .map(r -> new SongStat(SongResponse.from(songsById.get(((Number) r[0]).longValue())),
                        ((Number) r[1]).longValue()))
                .toList();

        return new DashboardResponse(
                totalPlays, uniqueSongs, seconds,
                genres.isEmpty() ? null : genres.get(0),
                artists.isEmpty() ? null : artists.get(0),
                genres, artists, topSongs,
                playsLastSevenDays(userId),
                historyService.recentlyPlayed(userId, 8).stream().map(h -> h.song()).toList());
    }

    /** Always returns exactly 7 entries (today and the 6 days before), with 0 for quiet days. */
    private List<DayStat> playsLastSevenDays(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate first = today.minusDays(6);
        Map<LocalDate, Long> counts = new HashMap<>();
        for (Object[] row : historyRepository.playsPerDay(userId, first.atStartOfDay())) {
            counts.put(toLocalDate(row[0]), ((Number) row[1]).longValue());
        }
        List<DayStat> days = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate d = first.plusDays(i);
            days.add(new DayStat(d, counts.getOrDefault(d, 0L)));
        }
        return days;
    }

    private static LocalDate toLocalDate(Object value) {
        if (value instanceof Date d) return d.toLocalDate();
        if (value instanceof LocalDate d) return d;
        return LocalDate.parse(value.toString());
    }
}
