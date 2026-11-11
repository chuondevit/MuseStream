package com.musestream.repository;

import com.musestream.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    @Query("select s.id from User u join u.favoriteSongs s where u.id = :userId")
    List<Long> findLikedSongIds(@Param("userId") Long userId);
}
