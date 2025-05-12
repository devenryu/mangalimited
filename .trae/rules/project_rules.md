# rules.md

# Personal Manhua Site Rules & Guidelines

This document outlines the conventions and best practices for building a personal manhua site with an amazing, no-login user experience using the MangaDex API.

---

## 1. Project Overview

* **Purpose**: A simple, personal manhua site—no authentication or user accounts required.
* **Core User Flow**:

  1. **Home Page**: View the latest manhua updates and search by name.
  2. **Search**: Enter a manhua title to find matching series.
  3. **Details Page**: View manhua metadata and a list of available chapters.
  4. **Read**: Click a chapter to read pages in sequence.

---

## 2. API Endpoints & Usage

| Functionality           | Endpoint & Query                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| **Fetch Latest Manhua** | `GET /manga?order[latestUploadedChapter]=desc&limit=<n>`                                    |
| **Search by Name**      | `GET /manga?title=<query>&limit=<n>`                                                        |
| **Get Manhua Details**  | `GET /manga/{mangaId}`                                                                      |
| **Get Cover Image**     | `GET /cover?manga[]={mangaId}` → `https://uploads.mangadex.org/covers/{mangaId}/{fileName}` |
| **Get Chapter List**    | `GET /manga/{mangaId}/feed?translatedLanguage[]=en&order[chapter]=asc&limit=<n>`            |
| **Get Chapter Pages**   | `GET /at-home/server/{chapterId}` → `{baseUrl}/data/{hash}/{filename}` for each image file  |

**Notes:**

* Use `limit` and `offset` for pagination if needed.
* Cache static assets (covers) and popular queries for 10+ minutes.
* Respect rate limit: **300 requests / 5 minutes** per IP.

---

## 3. UI & User Experience Guidelines

* **Homepage**:

  * Showcase a carousel or grid of the latest updated manhua covers.
  * Prominent search bar at top.
* **Search Results**:

  * Display cover thumbnail, title, and a short description.
  * Implement instant feedback (debounced search).
* **Details Page**:

  * Show full title, alt titles, description.
  * Display tags: genre, demographic, status.
  * List chapters in ascending order with clear numbering.
  * "Read Now" button next to each chapter.
* **Reader**:

  * Full-width image viewer, sequential navigation (next/prev buttons) that can be hidden the manga is shown as long stripe takes full width and hight of the screen.
  * Keyboard support: arrow keys for navigation.
  * Loading indicator while images load.
* **Responsive Design**:

  * Mobile-first approach; ensure readability on small screens.
* **No Authentication**:

  * No sign-up or login flows; everything is publicly accessible.

---

## 4. Error Handling & Loading States

* Show user-friendly messages on API errors.
* Global loading spinner for API calls.
* Retry up to 2 times on network errors with exponential backoff.

---