function request(url) {
  return fetch(url, {
    mode: "cors",
    method: 'GET',
    headers: {
      Accept: 'application/json',
    }
  }).then(res => {
    if(res.ok) {
      return res.json();
    }
    throw new Error('Network response was not ok.');
  }).catch(e => {
    console.error(e);
  })
}

function _e(tagName, param2, param3) {
  let attributes = {};
  let children = [];
  const ele = document.createElement(tagName);
  if (typeof param2 === 'object') {
    if (Array.isArray(param2)) children = param2;
    else {
      attributes = param2;
      if (Array.isArray(param3)) children = param3;
    }
  } else if (Array.isArray(param2)) children = param2;
  Object.keys(attributes).forEach((attr) => {
    const first2 = attr.slice(0, 2);
    if (first2 === 'on') {
      const evtName = attr.slice(2);
      ele.addEventListener(evtName, attributes[attr]);
    } else ele.setAttribute(attr, attributes[attr]);
  });
  children.forEach(c => ele.appendChild(c));
  return ele;
}

function _t(text) {
  const tN = document.createTextNode(text);
  return tN;
};