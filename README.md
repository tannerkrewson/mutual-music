# Mutual Music

**Try it out: www.tannerkrewson.com/mutual-music/**

Select a few Spotify playlists, and get back a new playlist containing only the songs that are in all of the selected playlists.

## History

Mutual Music is actually based off of [Spotify-in-Common](https://github.com/tannerkrewson/sic/), which I made a few months before I made Mutual Music. Spotify-in-Common has a very similiar premise, except that it compares 2 or more playlist, while Mutual Music compares two Spotify profiles.

The reason I developed Spotify-in-Common was to satisfy a curiosity of mine. Since 2015, my long-time friend Kevin Shannon has been cultivating a playlist of thousands of the most recoginzable songs in history in a playlist called "awesome songs". He posted to /r/music and it [blew up](https://www.reddit.com/r/Music/comments/7fb2ae/87_hours_of_awesome_songs_from_all_genres_and/)! A year before he posted his playlist, a similiar playlist was posted by Ben Shaw called "Guess that Tune". It has a few hundred more songs, but has an identical goal.

Although both playlists claimed to be exhaustive snapshots of popular music, they were each curated by just one person, so there is inherently some personal bias. So, I was curious to know what songs both of these playlists had in common. A playlist of these "in-common" songs would not necessarily be any more exhaustive, but it would remove some of the bias, such as songs that were thrown in because Kevin or Ben liked them personally, but aren't really recognizable in the grand scheme.

I couldn't figure out an easy way to make such a playlist, so I made Spotify-in-Common to do it for me.

## How it works

### Working with the Spotify API

When I began working with the Spotify API, I quickly realized that if you request the list of songs on a playlist that has more than 100 songs, it will only give you the first 100. The same issue occurs with adding songs to a playlist, both of which I had to do to make the app work as intended. So, I figured out that it allows you to specify an offset to the request, allowing you to receive songs that are past the 100th song mark. As a result, the app has to make a separate request every 100 songs, combine the songs into one big list, and continue until it has received all of the songs in the playlist. Therefore, the implementation will make `ceiling( number_of_songs / 100)` separate requests to Spotify for each playlist to get all of the tracks, and then again to create the new playlist.

In my first go at implementing this for Mutual Music, I added each of those requests to an array of Promises so that they would all execute in parallel. As it turns out, the Spotify API doesn't like that many requests coming in all at once, so it would commonly return `429 Too Many Request` (which, at the time, I did not handle, and the app would be stuck loading forever). Now, I wait for each request to complete before sending the next one. This is a bit slower, but it should never take more than a minute unless you're pushing 5,000+ songs. I also added in a sweet loading bar, and request retrying in case they do still fail.

### What makes two songs identical

The algorithm compares every song. First, it check to see if the URI of the songs being compared is identical. However, there are duplicates of the same song with different URIs on Spotify. It is common with compilations, remasters, and explicit/clean versions. So, it also compares the songs by their International Standard Recording Code (ISRC). If that fails, it will proceed to compare the Artist and Title of the songs. It checks to see if the titles of the two songs being the same, so `Bohemian Rhapsody` and `Bohemian Rhapsody - Remastered 2011` will be counted as the same song, as long as they are both by the same artist, in this case, `Queen`.

This could backfire if a single artist has two songs with titles called something like `Game` and `Gameboy`, but I believe the tradeoff of a few false positives is worth the potential for way more false negatives. You can always delete songs from the generated playlist, but if a song is missed, you can never find it.
