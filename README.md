# Spotify-in-Common

**Try it out: www.tannerkrewson.com/sic/**

Select a few Spotify playlists, and get back a new playlist containing only the songs that are in all of the selected playlists.

## How it works

The algorithm compares every song. First, it check to see if the URI of the songs being compared is identical. However, there are duplicates of the same song with different URIs on Spotify. It is common with compiliations, remasters, and explicit/clean versions. So, it also compares the songs by their International Standard Recording Code (ISRC). If that fails, it will proceed to compare the Artist and Title of the songs. It checks to see if the titles of the two songs being the same, so `Bohemian Rhapsody` and `Bohemian Rhapsody - Remastered 2011` will be counted as the same song, as long as they are both by the same artist, in this case, `Queen`.

When I began working with the Spotify API, I quickly realized that if you request the list of songs on a playlist that has more than 100 songs, it will only give you the first 100. The same issue occurs with adding songs to a playlist, both of which I had to do to make the app work as intended. So, I figured out that it allows you to specify an offset to the request, allowing you to receive songs that are past the 100th song mark. As a result, the app has to make a seperate request every 100 songs, combine the songs into one big list, and continue until it has received all of the songs in the playlist. Therefore, the implementation will make `ceiling( numberOfSongs / 100)` seperate requests to Spotify for each playlist to get all of the tracks, and then again to create the new playlist.
