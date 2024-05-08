// класс определяющий параметры игрового прямоугольника и метод для его отрисовки

function rect(color, x, y, width, height) {
  this.color = color; // цвет прямоугольника
  this.x = x; // координата х
  this.y = y; // координата у
  this.width = width; // ширина
  this.height = height; // высота
  // функция рисует прямоугольник согласно заданным параметрам
  this.draw = function() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}
// функция проверяет пересекаются ли переданные ей прямоугольные объекты

function collision(objA, objB) {
  if (objA.x + objA.width > objB.x && objA.x < objB.x + objB.width && objA.y + objA.height > objB.y && objA.y < objB.y + objB.height) {
      return true;
  }
  else {
      return false;
  }
}
// движение оппонента

function aiMove() {
  var y;
  // делаем скорость оппонента зависимой от скорости шарика
  switch (ball.vY) {
  case 2:
      vY = 2;
      break;
  case 3:
      vY = 3;
      break;
  case 4:
      vY = 4;
      break;
  case 5:
      vY = 5;
      break;
  case 6:
      vY = 5;
      break;
  case 7:
      vY = 6;
      break;
  case 8:
      vY = 6;
      break;
  case 9:
      vY = 6;
      break;
  case 0:
      vY = 0;
      break;
  }

  if (ball.y < ai.y + ai.height / 2) {
      y = ai.y - vY;
  }
  if (ball.y > ai.y + ai.height / 2) {
      y = ai.y + vY;
  }
  if (10 < y && y < game.height - ai.height - 10) {
      ai.y = y;
  }
}
// движение игрока

function playerMove(e) {
  if (start) {
      var y = e.pageY;
      // условие проверяет не выходит ли ракетка за пределы поля
      if (player.height / 2 + 10 < y && y < game.height - player.height / 2 - 10) {
          // привязываем положение мыши к середине ракетки
          player.y = y - player.height / 2;
      }
  }
}


function startGame() {
  if (!start) {
      ball.vX = -2;
      ball.vY = 2;
      start = true;
  }
}

// отрисовка игры

function draw() {
  game.draw(); // игровое поле
  // разделительная полоса
  for (var i = 10; i < game.height; i += 45) {
      ctx.fillStyle = "#ccc";
      ctx.fillRect(game.width / 2 - 10, i, 20, 30);
  }
  // рисуем на поле счёт
  ctx.font = 'bold 128px courier';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#ccc';
  ctx.fillText(ai.scores, 100, 0);
  ctx.fillText(player.scores, game.width - 100, 0);
  ai.draw(); // левая ракетка
  player.draw(); // ракетка игрока
  ball.draw(); // шарик
  if (!start) {
      // вывод статстики
      ctx.fillStyle = "#ccc";
      ctx.globalAlpha = 0.7;
      ctx.fillRect(0, 0, game.width, game.height);
      ctx.font = 'bold 16px courier';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#000';
      ctx.fillText("Total: " + game.total + " Win: " + game.win + " Lose: " + game.lose, game.width / 2, 0);
      ctx.font = 'bold 60px courier';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#000';
      ctx.fillText("canvasPong", game.width / 2, game.height / 2 - 50);
      ctx.font = 'bold 16px courier';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#000';
      ctx.fillText("click on me", game.width / 2, game.height / 2 + 25);
      // ctx.textBaseline = 'bottom';
      // ctx.fillText("A.Shpak @ 2011", game.width / 2, game.height);
  }
}
// игровые изменения которые нужно произвести

function update() {
  // двигаем ракетку оппонента
  aiMove();
  // меняем координаты шарика
  // Движение по оси У
  if (ball.y < 0 || ball.y + ball.height > game.height) {
      // соприкосновение с полом и потолком игрового поля
      ball.vY = -ball.vY;
  }
  // Движение по оси Х
  if (ball.x < 0) {
      // столкновение с левой стеной
      ball.vX = -ball.vX;
      player.scores++;
  }
  if (ball.x + ball.width > game.width) {
      // столкновение с правой
      ball.vX = -ball.vX;
      ai.scores++;
  }

  // Если счёт равен десяти то завершаем партию
  if (ai.scores === 10 || player.scores === 10) {
      if (ai.scores === 10) { // победа ai
          game.lose++;
          start = false;
          ball.x = game.width - player.width - 1.5 * ball.width - 10;
          ball.y = game.height / 2 - ball.width / 2;
          ai.y = game.height / 2 - ai.height / 2;
          player.y = game.height / 2 - ai.height / 2;
      } else { // победа игрока
          game.win++;
          start = false;
          ball.x = player.width + ball.width;
          ball.y = game.height / 2 - ball.width / 2;
          ai.y = game.height / 2 - ai.height / 2;
          player.y = game.height / 2 - ai.height / 2;
      }
      ball.vX = 0;
      ball.vY = 0;
      ai.scores = 0;
      player.scores = 0;
      game.total++;
  }

  // Соприкосновение с ракетками
  if ((collision(ai, ball) && ball.vX < 0) || (collision(player, ball) && ball.vX > 0)) {
      // приращение скорости шарика
      if (ball.vX < 9 && -9 < ball.vX) {
          if (ball.vX < 0) {
              ball.vX--;
          } else {
              ball.vX++;
          }
          if (ball.vY < 0) {
              ball.vY--;
          } else {
              ball.vY++;
          }
      }
      ball.vX = -ball.vX;
  }
  // приращение координат
  ball.x += ball.vX;
  ball.y += ball.vY;
}

function play() {
  draw(); // отрисовываем всё на холсте
  update(); // обновляем координаты
}
// Инициализация переменных

function init() {
  start = false;
  // объект который задаёт игровое поле
  game = new rect("#000", 0, 0, 480, 320);
  game.total = 0;
  game.win = 0;
  game.lose = 0;
  // Ракетки-игроки
  ai = new rect("#ffffff", 10, game.height / 2 - 40, 20, 80);
  player = new rect("#ffffff", game.width - 30, game.height / 2 - 40, 20, 80);
  // количество очков
  ai.scores = 0;
  player.scores = 0;
  // наш квадратный игровой "шарик"
  ball = new rect("#fff", 40, game.height / 2 - 10, 20, 20);
  // скорость шарика
  ball.vX = 0; // скорость по оси х
  ball.vY = 0; // скорость по оси у
  var canvas = document.getElementById("canvas");
  canvas.width = game.width;
  canvas.height = game.height;
  ctx = canvas.getContext("2d");
  canvas.onmousemove = playerMove;
  canvas.onclick = startGame;
  setInterval(play, 1000 / 50);
}

init();