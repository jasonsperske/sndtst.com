from bs4 import BeautifulSoup
import requests
import re
import json

root = 'https://web.archive.org/web/20171229080845/http://sndtst.com'

re_platform = re.compile(r'^\/web\/\d*\/http:\/\/sndtst\.com\/platform\/(\S*)$')
re_game = re.compile(r'^\/web\/\d*\/http:\/\/sndtst\.com(?::80)?\/([^\/]+)$')

def fetchPlatforms():
    print('Fetching platforms')
    r = requests.get(root)
    soup = BeautifulSoup(r.text, 'html5lib')
    for link in filter(re_platform.match,[l.get('href') for l in soup.find_all('a')]):
        m = re_platform.match(link)
        fetchGames(m.group(1))

def fetchGames(platform):
    print('  Fetching '+platform)
    data = dict()
    data['guid'] = platform
    data['games'] = []
    r = requests.get(root+'/platform/'+platform)
    soup = BeautifulSoup(r.text, 'html5lib')
    for link in filter(re_game.match,[l.get('href') for l in soup.find_all('a')]):
        m = re_game.match(link)
        game = m.group(1)
        title = fetchGame(platform, game)
        if title is not None:
            data['games'].append({'title': title, 'guid': game})

    with open('platform/'+platform+'.json', 'w') as outfile:
        json.dump(data, outfile)

def fetchGame(platform, game):
    print('     Fetching '+game)
    try:
        data = dict()
        data['guid'] = game
        r = requests.get(root+'/'+game)
        soup = BeautifulSoup(r.text, 'html5lib')
        title = soup.find('meta', property='sndtst:title')['content']
        data['platform'] = platform
        data['title'] = title
        data['composed_by'] = []
        for composer in soup.find_all('meta', property='sndtst:composed_by'):
            data['composed_by'].append(composer['content'])

        data['playlist'] = []
        for playlist in soup.find_all('ol', {'id': 'Playlist'}):
            for song in playlist.find_all('li'):
                songtitle = song.text[:-9]
                data['playlist'].append({'title': songtitle, 'guid': song['data-song']})

        data['id'] = data['playlist'][0]['guid'].split('-')[0]

        with open('game/'+game+'.json', 'w') as outfile:
            json.dump(data, outfile)

        return title
    except:
        print('Error fetching', platform, game)

fetchPlatforms()
