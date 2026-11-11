package com.musestream.service;

import com.musestream.dto.HistoryItemResponse;
import com.musestream.dto.SongResponse;
import com.musestream.model.ListeningHistory;
import com.musestream.repository.ListeningHistoryRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class HistoryService {

    private static final int SCAN_WINDOW = 300;

    private final ListeningHistoryRepository historyRepository;

    public HistoryService(ListeningHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    /** "Recently played": each song once, using its most recent play. */
    public List<HistoryItemResponse> recentlyPlayed(Long userId, int limit) {
        int max = Math.max(1, Math.min(limit, 50));
        List<ListeningHistory> recent = historyRepository.findRecent(userId, PageRequest.of(0, SCAN_WINDOW));
        Set<Long> seen = new HashSet<>();
        List<HistoryItemResponse> items = new ArrayList<>();
        for (ListeningHistory h : recent) {
            if (seen.add(h.getSong().getId())) {
                items.add(new HistoryItemResponse(SongResponse.from(h.getSong()), h.getPlayedAt()));
                if (items.size() >= max) {
                    break;
                }
            }
        }
        return items;
    }
}
