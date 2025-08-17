package com.cab.cab_backend.repository;

import com.cab.cab_backend.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    void deleteByOriginAndDestination(String origin, String destination);
}
