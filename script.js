(function () {

  // ===== ELEMENTOS =====
  const debugEl = document.getElementById("debug");
  const resEl = document.getElementById("resultado");
  const btn = document.getElementById("btnCalcular");

  // ===== DEBUG =====
  function log(msg) {
    debugEl.textContent = msg;
  }

  log("DEBUG: ✅ JS CARREGOU.\nClique em CALCULAR.");

  // ===== FUNÇÕES AUXILIARES =====
  function parseDateLocal(v) {
    const parts = (v || "").split("-");
    if (parts.length !== 3) return null;
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    const d = Number(parts[2]);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d); // data local (seguro no Safari)
  }

  function addDays(dateObj, days) {
    const d = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate()
    );
    d.setDate(d.getDate() + days);
    return d;
  }

  function anosCompletos(inicio, fim) {
    let anos = fim.getFullYear() - inicio.getFullYear();
    const m = fim.getMonth() - inicio.getMonth();

    if (m < 0 || (m === 0 && fim.getDate() < inicio.getDate())) {
      anos--;
    }
    return anos < 0 ? 0 : anos;
  }

  function formatBR(dateObj) {
    return dateObj.toLocaleDateString("pt-BR");
  }

  // ===== CÁLCULO =====
  function calcular() {
    try {
      const admStr = document.getElementById("admissao").value;
      const desStr = document.getElementById("desligamento").value;
      const tipoAviso = document.getElementById("tipo").value;
      const baseStr = document.getElementById("dataBase").value;

      log(
        "DEBUG: clique ✅\n" +
        "admissao=" + admStr + "\n" +
        "desligamento=" + desStr + "\n" +
        "tipo=" + tipoAviso + "\n" +
        "dataBase=" + baseStr
      );

      if (!admStr || !desStr || !tipoAviso || !baseStr) {
        resEl.innerHTML = "⚠️ Preencha todos os campos.";
        return;
      }

      const adm = parseDateLocal(admStr);
      const des = parseDateLocal(desStr);
      const base = parseDateLocal(baseStr);

      if (!adm || !des || !base) {
        resEl.innerHTML = "⚠️ Datas inválidas. Use o calendário.";
        return;
      }

      // Anos completos e dias proporcionais
      const anos = anosCompletos(adm, des);
      const diasProporcionais = anos * 3;
      const diasAviso = 30 + diasProporcionais;

      // 🔥 REGRA DEFINITIVA
      // Trabalhado → projeta | Indenizado → NÃO projeta
      const dataConsiderada =
        tipoAviso === "trabalhado"
          ? addDays(des, diasAviso)
          : des;

      // Período da data-base
      const inicioPeriodo = addDays(base, -30);
      const caiNaDataBase =
        dataConsiderada >= inicioPeriodo &&
        dataConsiderada <= base;

      // ===== SAÍDA =====
      resEl.innerHTML = `
        📌 <strong>Anos completos trabalhados:</strong> ${anos}<br>
        📌 <strong>Dias proporcionais:</strong> ${diasProporcionais}<br>
        📌 <strong>Dias de aviso (total):</strong> ${diasAviso}<br>
        📅 <strong>Data considerada:</strong> ${formatBR(dataConsiderada)}<br><br>
        ${
          caiNaDataBase
            ? <span style="color:#b00020;font-weight:bold;">🚨 Cai no período da data-base</span>
            : <span style="color:#0b6b2e;font-weight:bold;">✅ NÃO cai no período da data-base</span>
        }
      `;

      log(debugEl.textContent + "\n\nOK: cálculo executado ✅");

    } catch (e) {
      resEl.innerHTML = "❌ Erro no cálculo.";
      log("ERRO JS:\n" + (e && e.stack ? e.stack : e));
    }
  }

  // ===== EVENTO DO BOTÃO (ESSENCIAL) =====
  btn.addEventListener("click", calcular);

})();