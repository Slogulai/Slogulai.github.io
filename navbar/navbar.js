const main = document.querySelector('main');

const section = document.createElement('section');
section.classList.add('hello-container');
main.appendChild(section);

const img = document.createElement('img');
img.classList.add('img');
img.setAttribute('src', '../images/chrissloggett.png');
img.setAttribute('width', '500');
img.setAttribute('alt', 'Photo of Christopher Sloggett');
section.appendChild(img);

const p = document.createElement('p');
p.classList.add('bio');
p.textContent = `My name is Christopher Sloggett. I am a Senior student at Portland State University, majoring in Computer Science. Having been interested in web development for quite some time I am very excited to be a part of this class! In my off time, I enjoy suring, sailing, snowboarding, offroading, climbing, hiking, computers, and many many more things!`;
section.appendChild(p);
