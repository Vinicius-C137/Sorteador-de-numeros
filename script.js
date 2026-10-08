 const inicio = document.getElementById("inicio"),
        fim = document.getElementById("fim"),
        semRepetir = document.getElementById("semRepetir");
      const resultado = document.getElementById("resultado"),
        status = document.getElementById("status"),
        historico = document.getElementById("historico"),
        erro = document.getElementById("erro");
      let sorteados = [];
      function validar() {
        const a = Number(inicio.value),
          b = Number(fim.value);
        if (!Number.isInteger(a) || !Number.isInteger(b)) {
          return "Informe números inteiros válidos.";
        }
        if (a > b) {
          return "O início não pode ser maior que o fim.";
        }
        if (a === b && semRepetir.checked && sorteados.includes(a)) {
          return "Todos os números desse intervalo já foram sorteados.";
        }
        if (
          semRepetir.checked &&
          b - a + 1 <= sorteados.filter((n) => n >= a && n <= b).length
        ) {
          return "Todos os números desse intervalo já foram sorteados.";
        }
        return "";
      }
      function render() {
        if (!sorteados.length) {
          historico.innerHTML =
            '<span class="empty-history">Nenhum número sorteado ainda.</span>';
          return;
        }
        historico.innerHTML = sorteados
          .map((n) => `<span class="chip">${n}</span>`)
          .join("");
      }
      let sorteando = false;
      let animacao = null;
      function sortear() {
        if (sorteando) return;
        erro.textContent = "";
        const msg = validar();
        if (msg) {
          erro.textContent = msg;
          return;
        }
        const a = Number(inicio.value),
          b = Number(fim.value);
        let n;
        do {
          n = Math.floor(Math.random() * (b - a + 1)) + a;
        } while (semRepetir.checked && sorteados.includes(n));
        sorteando = true;
        document.getElementById("sortear").disabled = true;
        resultado.classList.remove("reveal", "empty");
        resultado.classList.add("rolling");
        status.textContent = "Sorteando...";
        let inicioAnimacao = performance.now();
        animacao = setInterval(() => {
          let provisoria;
          do {
            provisoria = Math.floor(Math.random() * (b - a + 1)) + a;
          } while (semRepetir.checked && sorteados.includes(provisoria));
          resultado.textContent = provisoria;
        }, 70);
        setTimeout(() => {
          clearInterval(animacao);
          animacao = null;
          resultado.textContent = n;
          resultado.classList.remove("rolling");
          void resultado.offsetWidth;
          resultado.classList.add("reveal");
          status.textContent = `Intervalo: ${a} a ${b}`;
          if (!sorteados.includes(n)) sorteados.unshift(n);
          render();
          sorteando = false;
          document.getElementById("sortear").disabled = false;
        }, 1100);
      }
      function limpar() {
        sorteados = [];
        resultado.textContent = "—";
        resultado.classList.add("empty");
        status.textContent = "Configure o intervalo e clique em sortear.";
        erro.textContent = "";
        render();
      }
      document.getElementById("sortear").addEventListener("click", sortear);
      document.getElementById("resetar").addEventListener("click", limpar);
      document
        .getElementById("limparHistorico")
        .addEventListener("click", limpar);
      [inicio, fim].forEach((el) =>
        el.addEventListener("input", () => (erro.textContent = "")),
      );