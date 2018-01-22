# sndtst.com
A node.js version of the original sndtst project (which was written in Java)

## History
the original sndtst.com was written very quickly in Java using my own project structure as a starting point, this had the unfortunate side effect of being a very complex starting point for a very simple site.  Because the goal was to do as little as possible, the server was very rarely updated with the latest software and libraries.  Unfortunately a distribution update corrupted the host image and destroyed the database.  While I assumed the only way to bring back the site would be to rebuild the database by hand I realized that https://web.archive.org might have a snapshot of the entire site.  With a little Python (found in [python/DownloadOldSite.py]) I was able to create a backup.  This new node.js restores the basic functionality of the original sndtst.com using this backup.  While this approach will not fully restore the original functionality it will bring back the music.
