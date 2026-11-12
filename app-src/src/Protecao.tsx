import { Component, type ReactNode } from "react";
import { registrarErro } from "./lib/erros";

/** Se uma tela quebrar, a família ainda vê o 192 e consegue recarregar. */
export class Protecao extends Component<{ children: ReactNode }, { quebrou: boolean }> {
  state = { quebrou: false };
  static getDerivedStateFromError() {
    return { quebrou: true };
  }
  componentDidCatch(erro: unknown) {
    registrarErro(erro);
  }
  render() {
    if (!this.state.quebrou) return this.props.children;
    return (
      <div className="app">
        <main className="conteudo sem-abas">
          <div className="card">
            <h2>Algo deu errado nesta tela</h2>
            <p className="muted">Já avisamos a equipe. Recarregue para continuar.</p>
            <button className="btn bloco" onClick={() => location.reload()}>Recarregar</button>
          </div>
          <a className="btn ps bloco" href="tel:192">Emergência: ligar 192</a>
        </main>
      </div>
    );
  }
}
