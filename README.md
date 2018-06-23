# Mutual Music

**Try it out: www.tannerkrewson.com/mutual-music/**

Using your Spotify accounts, Mutual Music creates a playlist of songs you and a friend both love. Mutual Music is built with [React](https://github.com/facebook/react/).

## History

Mutual Music is actually based off of [Spotify-in-Common](https://github.com/tannerkrewson/sic/), which I made a few months before I made Mutual Music. Spotify-in-Common has a very similar premise, except that it compares 2 or more playlist, while Mutual Music compares two Spotify profiles.

The reason I developed Spotify-in-Common was to satisfy a curiosity of mine. Since 2015, my long-time friend [Kevin Shannon](https://github.com/kevers429) has been cultivating a playlist of thousands of the most recognizable songs in history in a playlist called "awesome songs". He [posted it](<(https://www.reddit.com/r/Music/comments/7fb2ae/87_hours_of_awesome_songs_from_all_genres_and/)>) to /r/music and it blew up, which was pretty cool. A year before he posted his playlist, a similar playlist was posted by Ben Shaw called "Guess that Tune". It has a few hundred more songs but has an identical goal.

Although both playlists claimed to be exhaustive snapshots of popular music, they were each curated by just one person, so there is inherently some personal bias. So, I was curious to know what songs both of these playlists had in common. A playlist of these "in-common" songs would not necessarily be any more exhaustive, but it would remove some of the bias, such as songs that were thrown in because Kevin or Ben liked them personally but aren't really recognizable in the grand scheme.

I couldn't figure out an easy way to make such a playlist, so I made Spotify-in-Common to do it for me.

Spotify-in-Common worked great for my original purpose, but I would find that idea of "mutual songs" has a lot more possibilities. One thing I would find myself doing is making two big playlists, one of all of my songs and the other full of one of my friend's songs and putting them through Spotify-in-Common. The resulting playlist would, of course, be full of songs that both of us like: our mutual music. And thus, the idea for Mutual Music was born.

Mutual Music automates the put-all-of-your-songs-into-one-playlist process by going through your top 20 playlists and all of your saved music automatically, making it much convenient than Spotify-in-Common, at least for this purpose. In addition, I made sure that Mutual Music's AI is straightforward so that anyone can find their Mutual Music within seconds.

## How it works

### Working with the Spotify API

When I began working with the Spotify API, I quickly realized that if you request the list of songs on a playlist that has more than 100 songs, it will only give you the first 100. The same issue occurs with adding songs to a playlist, both of which I had to do to make the app work as intended. So, I figured out that it allows you to specify an offset to the request, allowing you to receive songs that are past the 100th song mark. As a result, the app has to make separate request every 100 songs, combine the songs into one big list, and continue until it has received all of the songs in the playlist. Therefore, the implementation will make `ceiling( number_of_songs / 100)` separate requests to Spotify for each playlist to get all of the tracks, and then again to create the new playlist.

In my first go at implementing this for Mutual Music, I added each of those requests to an array of Promises so that they would all execute in parallel. As it turns out, the Spotify API doesn't like that many requests coming in all at once, so it would commonly return `429 Too Many Request` (which, at the time, I did not handle, and the app would be stuck loading forever). Now, I wait for each request to complete before sending the next one. This is a bit slower, but it should never take more than a minute unless you're pushing 5,000+ songs. I also added in a sweet loading bar, and request retrying in case they do still fail.

When I first started making Mutual Music, I imagined that I would get a list of the people you follow on Spotify, and let you pick from them. Unfortunately, [this is not possible](https://github.com/spotify/web-api/issues/4) with the Spotify API. So, you must paste the profile link of the friend directly. The problem with this is that many people don't know how to find someone's Spotify profile link. To circumvent this, I have included visual instructions on how to do this on both mobile and desktop.

### Caching songs

If you want to generate more than one playlist for multiple different friends, Mutual Music caches all of the songs it scans from your library after the first time it runs in the Local Storage in your browser for 24 hours. The makes subsequent playlist generations run much faster, as it only has to scan the friend's songs. It also means less calls to the Spotify API overall.
