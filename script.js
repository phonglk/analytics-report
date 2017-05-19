const apiUrl = 'https://voz-living.appspot.com/query?id=agxzfnZvei1saXZpbmdyFQsSCEFwaVF1ZXJ5GICAgICAgIAKDA&format=json';
const minThreadUrl = (id) => `https://crossorigin.me/https://vozforums.com/printthread.php?t=${id}&pp=1`

const REG_TITLE = /showthread\.php[^>]*><strong>([^<]*)<\/strong>/;
const REG_FORUM = /forumdisplay\.php\?f=(\d+)[^>]*><strong>([^<]*)<\/strong>/;

function getTopList() {
  return request(apiUrl).then(json => Promise.all(json.rows.map(([cat, threadId, hit]) => {
    const _threadInfo = localStorage.getItem(`t${threadId}`);
    if (_threadInfo === null) {
      return new Promise((resolve) => {
        fetch(minThreadUrl(threadId))
          .then(res => res.text())
          .then(html => {
            const [, title] = html.match(REG_TITLE);
            const [, fid, ftitle] = html.match(REG_FORUM);
            const threadInfo = {
              title,
              fid,
              ftitle,
            }
            localStorage.setItem(`t${threadId}`, JSON.stringify(threadInfo));
            resolve({
              id: threadId,
              title,
              fid,
              ftitle,
              hit,
            })
          })
          .catch(e => {
            console.error(e);
            resolve({
              id: threadId,
              title: threadId,
              fid: null,
              ftitle: null,
              hit,
            });
          });
      })
    }
    const threadInfo = JSON.parse(_threadInfo);
    return Promise.resolve(Object.assign({
      id: threadId,
      hit,
    }, threadInfo));
  })));
}

function buildTable(threads) {
  return _e('table', {class: 'pure-table pure-table-horizontal'}, [
    _e('thead', [_e('tr', [
      _e('th', [_t('#')]),
      _e('th', [_t('Thread')]),
      _e('th', [_t('Forum')]),
      _e('th', [_t('Hit')]),
    ])]),
    _e('tbody', threads.map((t, i) => _e('tr', [
      _e('td', [_t(i+1)]),
      _e('td', [_e('a', {
          href: `https://vozforums.com/showthread.php?t=${t.id}`,
          target: '_blank',
        }, [_t(t.title)]
      )]),
      _e('td', [_t(t.ftitle)]),
      _e('td', [_t(t.hit)]),
    ])))
  ]);
}

function replace(newDiv) {
  const oldChild = document.querySelector('#root > div');
  return document.querySelector('#root').replaceChild(newDiv, oldChild);
}

function main() {
  replace(_e('div', [_t('Loading Thớt ...')]));
  getTopList().then(threads => {
    replace(_e('div', [buildTable(threads)]));
    console.log(threads);
  });

}

// -- dom utils


main();
