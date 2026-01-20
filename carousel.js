/* ======= data (replace / extend as needed) ======= */
const items = [
  { day: [4, 2025], title: "Dad and his lovely Wife", subtitle: "This must have happened after church hehe.", img: "images/1.jpg" },
  { day: [12, 2024], title: "Gloria's 2nd Birthday", subtitle: "More and more cakes to come...", img: "images/2.jpg" },
  { day: [12, 2024], title: "Another Vacation at Lagos", subtitle: "Dad and the boys out to the zenith roundabout in lagos.", img: "images/3.jpg" },
  { day: [6, 2020], title: "Baby Gloria Pre-Birth.", subtitle: "Dad was soooooooo happy when he found out she was a girl.", img: "images/4.jpg" },
  { day: [9, 2020], title: "Dad and Baby Charis Spending Quality Time.", subtitle: "Ahh this feels js like yesterday.", img: "images/5.jpg" },
  { day: [4, 2023], title: "Dad, Enoch and Charis", subtitle: "Aww charis couldn't roll hs tongue here...", img: "images/6.jpg" },
  { day: ["?","?"], title: "Dad taking a nap.", subtitle: "After a lonnnnnng day fixing things and coming from an even. He rested.", img: "images/7.jpg" },
  { day: [2, 2024], title: "Dad and baby Gloria.", subtitle: "Look at her chubby cheeks. I think I still saw this carrier recently.",  img: "images/8.jpg" },
  { day: [6, 2024], title: "Dad and Victor.", subtitle: "I was forced to take this picture. T-T",  img: "images/9.jpg" },
  { day: [6, 2024], title: "Dad and Gloria yet again.", subtitle: "Having fun playing with dad I see...",  img: "images/10.jpg" },
  { day: [12, 2024], title: "Dad in Abuja for a vacation hehe.", subtitle: "Where were the boys here? probably playing with their cousins somewhere...",  img: "images/11.jpg" },
  { day: [3, 2025], title: "Dad in kokodome.", subtitle: "Ah i remember we wanted to swim but didn't end up doing that. Thanks for the food dad.",  img: "images/12.jpg" },
  { day: [1, 2026], title: "Dad \" processing \" the turkey with The boys", subtitle: "Ah so now we know how to \"process\" chickens...",  img: "images/13.jpg" },
  { day: ["?", 2003], title: "About to get married?", subtitle: "Smile joor iya david.",  img: "images/14.jpg" },
  { day: [10, 2008], title: "A new family. Cute!", subtitle: "With my cute chubby cheeks :P",  img: "images/15.jpg" },
  { day: ["?", 2025], title: "Supporting Mom w that new vid", subtitle: "Hehehe the music was peak frfr.",  img: "images/16.jpg" },
  { day: [12, 2024], title: "Dad and his Twin", subtitle: "Heheheheheh.", img: "images/17.jpg" },
];

/* ======= DOM refs ======= */
const bigCard = document.getElementById('bigCard');
const thumbs = document.getElementById('thumbs');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const bigCardSubTitle = document.getElementById('bigCardSubTitle');
const bigCardTitle = document.getElementById('bigCardTitle');

const day = document.getElementById('day');
const month = document.getElementById('month');

const thumbsEl = document.getElementById('thumbs');

let activeIndex = 0;
const thumbEls = [];

/* create thumbs */
items.forEach((it, i) => {
  const t = document.createElement('div');
  t.className = 'thumb';
  t.style.backgroundImage = `url(${it.img})`;
  t.setAttribute('role','button');
  t.setAttribute('aria-label', `${it.title} - ${it.subtitle}`);
  t.addEventListener('click', ()=> setActive(i));
  t.onPressed = () => setActive(0, {center:true});
  thumbs.appendChild(t);
  thumbEls.push(t);
});

/* setActive: update big image and selected thumb, center thumb in strip */
function setActive(index, {center=true} = {}) {
  activeIndex = (index % items.length + items.length) % items.length;
  const item = items[activeIndex];

  // update big preview:
  bigCard.style.backgroundImage = `url(${item.img})`;
  bigCard.setAttribute('aria-label', `${item.title} — ${item.subtitle}`);
  bigCardTitle.textContent = `${item.title}`;
  bigCardSubTitle.textContent = `${item.subtitle}`;
  day.textContent = item.day[0]
  month.textContent = item.day[1]

  // update thumb visuals:
  thumbEls.forEach((el, i) => el.classList.toggle('selected', i === activeIndex));

  // center the selected thumbnail in the scrollable thumbs row:
  if (center) {
    const selected = thumbEls[activeIndex];
    // compute centered scrollLeft
    const container = thumbs;
    const left = selected.offsetLeft + selected.offsetWidth/2 - container.clientWidth/2;
    container.scrollTo({ left: left, behavior: 'smooth' });
  }
  centerSelectedThumb()
}

/* arrows and keyboard */
prevBtn.addEventListener('click', ()=> setActive(activeIndex - 1));
nextBtn.addEventListener('click', ()=> setActive(activeIndex + 1));
document.addEventListener('keydown', (e)=>{
  if (e.key === 'ArrowLeft') setActive(activeIndex - 1);
  if (e.key === 'ArrowRight') setActive(activeIndex + 1);
});

/* optional autoplay (enable by uncommenting) */
let auto = null;
// function startAuto(){ auto = setInterval(()=> setActive(activeIndex+1), 3500) }
// function stopAuto(){ clearInterval(auto); auto = null }
// startAuto();
// thumbs.addEventListener('mouseenter', stopAuto); thumbs.addEventListener('mouseleave', startAuto);
// bigCard.addEventListener('mouseenter', stopAuto); bigCard.addEventListener('mouseleave', startAuto);

/* initial render */
setActive(0, {center:true});

/* handle window resize: keep selected thumbnail centered */
let resizeTO;
window.addEventListener('resize', ()=> {
  clearTimeout(resizeTO);
  resizeTO = setTimeout(()=> setActive(activeIndex), 120); // recenter after resizing
});

let isDown = false;
let startX = 0;
let scrollStart = 0;

thumbsEl.addEventListener('pointerdown', (e) => {
  isDown = true;
  thumbsEl.setPointerCapture(e.pointerId);
  thumbsEl.classList.add('dragging');

  startX = e.clientX;
  scrollStart = thumbsEl.scrollLeft;
});

thumbsEl.addEventListener('pointermove', (e) => {
  if (!isDown) return;
  const dx = e.clientX - startX;
  thumbsEl.scrollLeft = scrollStart - dx;
});

thumbsEl.addEventListener('pointerup', () => endDrag());
thumbsEl.addEventListener('pointercancel', () => endDrag());
thumbsEl.addEventListener('pointerleave', () => endDrag());

function endDrag() {
  isDown = false;
  thumbsEl.classList.remove('dragging');
}

function centerSelectedThumb() {
  const selected = thumbEls[activeIndex];
  const container = thumbsEl;

  const containerWidth = container.clientWidth;
  const scrollWidth = container.scrollWidth;

  // naive center target
  let target = selected.offsetLeft + selected.offsetWidth / 2 - containerWidth / 2;

  // clamp to bounds
  target = Math.max(0, Math.min(target, scrollWidth - containerWidth));

  container.scrollTo({
    left: target,
    behavior: 'smooth'
  });
}


const peopleData = [
  { name: "Enoch", text: `
From Enoch
To the Man of the house, our celebrant—dad

Happy Birthday to you Daddy. Gosh, we thank God for such a wonderful father like you. On this special day we want to look back and thank you for such a mighty force you have been towards the growth of this family. You mean much more than a mechanical engineer at work, more the engineer of your home
We give thanks to Almight God for bringing you to see your day, in good health, a joyful mood and peace of mind.


We thank you for your support, always providing for this family, dad. There has never been a case where we lacked, thanks to the hardworking you put, thank you dad

We thank you for every iko you put on our heads, your rod of correction—nothing hits better than a factory reset

There has never been a case where our academical fees haven't been met. infact many at times you are the one that have to remind us about it. How blessed are we to have a  father like you

We thank you for the midimidi you have put in our bellies,
the smiles you've put on our faces and the love you have shown for us. Thank you so much dad!

As you enter into this new chapter of your life, doors that were once closed to you previously are opened in Jesus name. Your life shall be a testimony of God's goodness
You will only grow greater and greater as you age like fine wine. With long life will God satisfy you and will you live to see your children's children, in the name of Jesus

...we wish you many happy returns, sir, long life and prosperity—hip hip hip, hurry!
Daddy, go forth and enjoy your new year` },
  { name: "Victor", text: `
Happy Birthday Dad!

Long life and prosperity. It is with great honor for me to have you as my father.
Thank you for the many teaching you've given me sir, from how to install an inverter to making the perfect eggs for eating bread (not to soggy or dry) to how to paint the walls of a how to how to be a responsible and cultured man.
I pray that the lord will continue to be your strength, the lord will continue to strengthen you and you will live to see you children's children up to the forth generation and even more as Jesus tarries.

Happy birthday sir, I hope you enjoy your day and eat PLENTY of cake.
Enjoy you great new year IJN!!!
  ` },
  { name: "David", text: `
Happy Birthday, Dad.
From your first son, thank you for every sacrifice, every provision, and every quiet way you’ve made sure our family never lacked. I’m deeply grateful for your hard work, wisdom, and constant love. I pray that God blesses you with long life, good health, renewed strength, and peace in all you do. May your hands never lack, your efforts always bear fruit, and your heart be filled with joy. Thank you for being our provider, our teacher, and our example. We love you.
  ` },
];

const container = document.getElementById('peopleContainer');

peopleData.forEach(person => {
  const card = document.createElement('div');
  card.className = 'post-it people-card';
  bigCard.style.backgroundColor = ""
  card.innerHTML = `
    <h3 class="noto-sans-display-font" style="text-transform: capital;">from - ${person.name}</h3>
    <p class="montserrat-text" style="padding-left: 10px;">${person.text.replace(/\n/g, "<br>")}</p>
  `;
  container.appendChild(card);
});
