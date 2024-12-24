const elemCard = document.querySelector('div.card');
const elemClickIcon = document.querySelector('span.click-icon');

elemCard.addEventListener('click', function() {
  elemCard.classList.toggle('is-opened');
  elemClickIcon.classList.toggle('is-hidden');
});


// SNOW

class Snowflake {
  constructor(size, x, y, vx, vy) {
      this.size = size;
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.hit = false;
      this.melt = false;

      this.div = document.createElement('div');
      this.div.classList.add('snowflake');
      this.div.style.width = `${this.size}px`;
      this.div.style.height = `${this.size}px`;
  }

  move(mouseX, mouseY, wind) {
      if (this.hit) {
          if (Math.random() > 0.995) this.melt = true;
      } else {
          this.x += this.vx + Math.min(Math.max(wind, -10), 10);
          this.y += this.vy;
      }

      // Reposicionar si se sale de los límites de la pantalla
      if (this.x > window.innerWidth + this.size) {
          this.x -= window.innerWidth + this.size;
      } else if (this.x < -this.size) {
          this.x += window.innerWidth + this.size;
      }

      if (this.y > window.innerHeight + this.size) {
          this.x = Math.random() * window.innerWidth;
          this.y -= window.innerHeight + this.size * 2;
          this.melt = false;
      }

      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      this.hit = !this.melt && this.y < mouseY && dx * dx + dy * dy < 2400;
  }

  draw() {
      this.div.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
  }
}

const Snow = (() => {
  const flakes = [];
  const flakesTotal = 250;
  let wind = 0;
  let mouseX = 0;
  let mouseY = 0;

  const update = () => {
      flakes.forEach(flake => {
          flake.move(mouseX, mouseY, wind);
          flake.draw();
      });
      requestAnimationFrame(update);
  };

  const init = (container) => {
      for (let i = 0; i < flakesTotal; i++) {
          const size = (Math.random() + 0.2) * 12 + 1;
          const flake = new Snowflake(
              size,
              Math.random() * window.innerWidth,
              Math.random() * window.innerHeight,
              Math.random() - 0.5,
              size * 0.3
          );
          container.appendChild(flake.div);
          flakes.push(flake);
      }

      container.addEventListener('mousemove', (event) => {
          mouseX = event.clientX;
          mouseY = event.clientY;
          wind = (mouseX - window.innerWidth / 2) / window.innerWidth * 6;
      });

      container.addEventListener('touchstart', (event) => {
          const touch = event.targetTouches[0];
          mouseX = touch.clientX;
          mouseY = touch.clientY;
          event.preventDefault();
      });

      window.addEventListener('deviceorientation', (event) => {
          if (event.gamma != null) {
              wind = event.gamma / 10;
          }
      });

      update();
  };

  return { init };
})();

window.addEventListener('load', () => {
  setTimeout(() => {
      const container = document.getElementById('snow');
      if (container) Snow.init(container);
  }, 4000); // 4 segundos
});
