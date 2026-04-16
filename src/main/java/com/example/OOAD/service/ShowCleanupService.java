package com.example.OOAD.service;

import com.example.OOAD.model.Show;
import com.example.OOAD.repository.BookingRepository;
import com.example.OOAD.repository.ShowRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ShowCleanupService {

    private final ShowRepository showRepository;
    private final BookingRepository bookingRepository;

    public ShowCleanupService(ShowRepository showRepository, BookingRepository bookingRepository) {
        this.showRepository = showRepository;
        this.bookingRepository = bookingRepository;
    }

    @Scheduled(fixedDelayString = "${app.show.cleanup-interval-ms:3600000}")
    @Transactional
    public void cleanupExpiredShows() {
        LocalDateTime now = LocalDateTime.now();
        List<Show> expiredShows = showRepository.findByArchivedFalseAndShowTimeBefore(now);

        for (Show show : expiredShows) {
            boolean hasBookings = bookingRepository.existsByShowShowId(show.getShowId());
            if (hasBookings) {
                show.setArchived(true);
                show.setArchivedAt(now);
                showRepository.save(show);
            } else {
                showRepository.delete(show);
            }
        }
    }
}