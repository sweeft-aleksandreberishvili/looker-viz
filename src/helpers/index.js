export const removeStyles = async function () {
  const links = document.getElementsByTagName("link");
  while (links[0]) links[0].parentNode.removeChild(links[0]);
};

export const loadStylesheet = function (link) {
  if (!link) return;

  const linkElement = document.createElement("link");

  linkElement.setAttribute("rel", "stylesheet");
  linkElement.setAttribute("href", link);

  document.getElementsByTagName("head")[0].appendChild(linkElement);
};
