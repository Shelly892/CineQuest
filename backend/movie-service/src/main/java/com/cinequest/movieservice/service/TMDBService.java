package com.cinequest.movieservice.service;

import com.cinequest.movieservice.model.Movie;
import com.cinequest.movieservice.model.TMDBResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class TMDBService {

//final 字段，通过lombok生成构造函数。 依赖注入的字段（加final）
    private final RestTemplate restTemplate;
    private final RedisTemplate<String,Object> redisTemplate;

    // 配置注入的字段（不加final）
    @Value("${tmdb.api.base-url}")
    private String tmdbBaseUrl;

    @Value("${tmdb.api.key}")
    private String tmdbApiKey;

    @Value("${cache.ttl.popular}")
    private long popularCacheTTL;

    @Value("${cache.ttl.details}")
    private long detailsCacheTTL;

    @Value("${cache.ttl.search}")
    private long searchCacheTTL;


    // get popular movies
    @CircuitBreaker(name = "tmdbService", fallbackMethod = "getPopularMoviesFallback")
    @Retry(name = "tmdbService")
    public TMDBResponse getPopularMovies(int page) {
        String cacheKey = "movies:popular:" + page;

        // 1. 检查 Redis 缓存
        TMDBResponse cachedResponse = (TMDBResponse) redisTemplate.opsForValue().get(cacheKey);
        if (cachedResponse != null) {
            log.info("Cache hit for popular movies page {}", page);
            return cachedResponse;
        }

        // 2. 缓存未命中，调用 TMDB API
        log.info("Cache miss for popular movies page {}, calling TMDB API", page);
        String url = String.format("%s/movie/popular?api_key=%s&page=%d&language=en-US",
                tmdbBaseUrl, tmdbApiKey, page);

        TMDBResponse response = restTemplate.getForObject(url, TMDBResponse.class);

        // 3. 存入 Redis 缓存
        if (response != null) {
            redisTemplate.opsForValue().set(cacheKey, response, popularCacheTTL, TimeUnit.SECONDS);
            log.info("Cached popular movies page {} for {} seconds", page, popularCacheTTL);
        }

        return response;
    }
// get movie info details
    @CircuitBreaker(name = "tmdbService", fallbackMethod = "getMovieDetailsFallback")
    @Retry(name = "tmdbService")
    public Movie getMovieDetails(Long movieId) {
        String cacheKey = "movies:details:" + movieId;

        // 检查缓存
        Movie cachedMovie = (Movie) redisTemplate.opsForValue().get(cacheKey);
        if (cachedMovie != null) {
            log.info("Cache hit for movie details {}", movieId);
            return cachedMovie;
        }

        // 调用 API
        log.info("Cache miss for movie details {}, calling TMDB API", movieId);
        String url = String.format("%s/movie/%d?api_key=%s&language=en-US",
                tmdbBaseUrl, movieId, tmdbApiKey);

        Movie movie = restTemplate.getForObject(url, Movie.class);

        // 存入缓存
        if (movie != null) {
            redisTemplate.opsForValue().set(cacheKey, movie, detailsCacheTTL, TimeUnit.SECONDS);
            log.info("Cached movie details {} for {} seconds", movieId, detailsCacheTTL);
        }

        return movie;
    }

    // search for movies
    @CircuitBreaker(name = "tmdbService", fallbackMethod = "searchMoviesFallback")
    @Retry(name = "tmdbService")
    public TMDBResponse searchMovies(String query, int page) {
        String cacheKey = "movies:search:" + query + ":" + page;

        // 检查缓存
        TMDBResponse cachedResponse = (TMDBResponse) redisTemplate.opsForValue().get(cacheKey);
        if (cachedResponse != null) {
            log.info("Cache hit for search query: {}", query);
            return cachedResponse;
        }

        // 调用 API
        log.info("Cache miss for search query: {}, calling TMDB API", query);
        String url = String.format("%s/search/movie?api_key=%s&query=%s&page=%d&language=en-US",
                tmdbBaseUrl, tmdbApiKey, query, page);

        TMDBResponse response = restTemplate.getForObject(url, TMDBResponse.class);

        // 存入缓存
        if (response != null) {
            redisTemplate.opsForValue().set(cacheKey, response, searchCacheTTL, TimeUnit.SECONDS);
            log.info("Cached search results for '{}' page {} for {} seconds", query, page, searchCacheTTL);
        }

        return response;
    }

    // Fallback functions
    private TMDBResponse getPopularMoviesFallback(int page, Exception ex) {
        log.error("Fallback triggered for popular movies page {}: {}", page, ex.getMessage());

        TMDBResponse fallbackResponse = new TMDBResponse();
        fallbackResponse.setPage(page);
        fallbackResponse.setResults(new ArrayList<>());
        fallbackResponse.setTotalPages(0);
        fallbackResponse.setTotalResults(0);

        return fallbackResponse;
    }

    private Movie getMovieDetailsFallback(Long movieId, Exception ex) {
        log.error("Fallback triggered for movie details {}: {}", movieId, ex.getMessage());

        Movie fallbackMovie = new Movie();
        fallbackMovie.setId(movieId);
        fallbackMovie.setTitle("Movie information temporarily unavailable");
        fallbackMovie.setOverview("Please try again later.");

        return fallbackMovie;
    }

    private TMDBResponse searchMoviesFallback(String query, int page, Exception ex) {
        log.error("Fallback triggered for search query '{}': {}", query, ex.getMessage());

        TMDBResponse fallbackResponse = new TMDBResponse();
        fallbackResponse.setPage(page);
        fallbackResponse.setResults(new ArrayList<>());
        fallbackResponse.setTotalPages(0);
        fallbackResponse.setTotalResults(0);

        return fallbackResponse;
    }
}
