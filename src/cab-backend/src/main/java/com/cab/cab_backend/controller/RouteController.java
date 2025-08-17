package com.cab.cab_backend.controller;

import com.cab.cab_backend.entity.Route;
import com.cab.cab_backend.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")  // allow React
@RestController
@RequestMapping("/routes") //✅ allow frontend React app
public class RouteController {

    @Autowired
    private RouteRepository routeRepository;

    // ✅ Insert Route
    @PostMapping
    public ResponseEntity<?> addRoute(@RequestBody Route route) {
        if (route.getOrigin() == null || route.getDestination() == null || route.getDistanceKm() == null) {
            return ResponseEntity.badRequest().body("Origin, Destination, and Distance are required fields.");
        }
        Route savedRoute = routeRepository.save(route);
        return ResponseEntity.created(URI.create("/routes" + savedRoute.getRouteId())).body(savedRoute);
    }

    // ✅ Get all routes
    @GetMapping
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(routeRepository.findAll());
    }

    // ✅ Get route by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getRouteById(@PathVariable Long id) {
        return routeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Update route
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoute(@PathVariable Long id, @RequestBody Route updatedRoute) {
        return routeRepository.findById(id).map(existingRoute -> {
            existingRoute.setOrigin(updatedRoute.getOrigin());
            existingRoute.setDestination(updatedRoute.getDestination());
            existingRoute.setDistanceKm(updatedRoute.getDistanceKm());
            return ResponseEntity.ok(routeRepository.save(existingRoute));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ Delete by ID
    @CrossOrigin(origins = "http://localhost:5173")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoute(@PathVariable Long id) {
        if (routeRepository.existsById(id)) {
            routeRepository.deleteById(id);
            return ResponseEntity.ok("Route deleted successfully!");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Delete by Origin & Destination
    @DeleteMapping
    public ResponseEntity<String> deleteByOriginAndDestination(
            @RequestParam String origin,
            @RequestParam String destination) {
        routeRepository.deleteByOriginAndDestination(origin, destination);
        return ResponseEntity.ok("Route deleted successfully by origin & destination!");
    }
}
