// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class TicTacToe extends cc.Component {
  @property(cc.Label)
  xLabel: cc.Label = null;

  @property(cc.Label)
  oLabel: cc.Label = null;

  @property(cc.Node)
  oldAnchor: cc.Node = null;

  @property(cc.Prefab)
  buttonPrefab: cc.Prefab = null;

  // LIFE-CYCLE CALLBACKS:
  readonly width = 3;
  readonly height = 3;
  buttons: cc.Node[][];
  turn: TicTacToeSubjects;
  winner?: TicTacToeSubjects;
  xPoints: number;
  oPoints: number;

  onLoad() {
    this.buildButtonList();
    this.xPoints = 0;
    this.oPoints = 0;
    this.turn = TicTacToeSubjects.X;
    this.winner = TicTacToeSubjects.NOT_OVERED;
  }
  buildButtonList() {
    this.buttons = [];
    for (let i = 0; i < 3; i++) {
      this.buttons.push([]);
    }

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.width; j++) {
        const button = cc.instantiate(this.buttonPrefab);
        button.x = 80 - i * 80;
        button.y = 80 - j * 80;
        const handler = new cc.Component.EventHandler();
        handler.target = this.node;
        handler.handler = "clickButton";
        handler.component = "TicTacToe";
        handler.customEventData = `${i}-${j}`;
        button.getComponent(cc.Button).clickEvents.push(handler);
        this.node.addChild(button);
        this.buttons[i][j] = button;
      }
    }
  }

  clickButton(event: cc.Event, botao: string) {
    const nomeSeparado = botao.split("-");
    const x = parseInt(nomeSeparado[0]);
    const y = parseInt(nomeSeparado[1]);
    const buttonLabel = this.getLabelFromButton(this.buttons[x][y]);
    if (buttonLabel.string == "") {
      buttonLabel.string = this.turn;
      this.checkIfGameOver();
      this.changeTurn();
    }
  }
  getLabelFromButton(button: cc.Node): cc.Label {
    return button
      .getChildByName("Background")
      .getChildByName("Label")
      .getComponent(cc.Label);
  }

  getValueFromButton(button: cc.Node): string {
    return button
      .getChildByName("Background")
      .getChildByName("Label")
      .getComponent(cc.Label).string;
  }

  checkIfGameOver() {
    let overed = false;
    for (let i = 0; i < this.width; i++) {
      if (
        this.getValueFromButton(this.buttons[i][0]) != "" &&
        this.buttons[i][0] == this.buttons[i][1] &&
        this.buttons[i][1] == this.buttons[i][2]
      ) {
        overed = true;
      }
    }
    for (let i = 0; i < this.width; i++) {
      if (
        this.getValueFromButton(this.buttons[0][i]) != "" &&
        this.getValueFromButton(this.buttons[0][i]) ==
          this.getValueFromButton(this.buttons[1][i]) &&
        this.getValueFromButton(this.buttons[1][i]) ==
          this.getValueFromButton(this.buttons[2][i])
      ) {
        overed = true;
      }
    }
    if (
      this.getValueFromButton(this.buttons[0][0]) != "" &&
      this.getValueFromButton(this.buttons[0][0]) ==
        this.getValueFromButton(this.buttons[1][1]) &&
      this.getValueFromButton(this.buttons[1][1]) ==
        this.getValueFromButton(this.buttons[2][2])
    ) {
      overed = true;
    }
    if (
      this.getValueFromButton(this.buttons[2][0]) != "" &&
      this.getValueFromButton(this.buttons[2][0]) ==
        this.getValueFromButton(this.buttons[1][1]) &&
      this.getValueFromButton(this.buttons[1][1]) ==
        this.getValueFromButton(this.buttons[0][2])
    ) {
      overed = true;
    }
    if (overed) {
      if (this.turn == TicTacToeSubjects.X) {
        this.winner = TicTacToeSubjects.X;
        this.xPoints++;
        this.resetTable();
      } else {
        this.winner = TicTacToeSubjects.O;
        this.oPoints++;
        this.resetTable();
      }
    }
    if (this.verifyIfAllButtonsAreFill()) {
      if (this.winner == TicTacToeSubjects.NOT_OVERED) {
        this.winner = TicTacToeSubjects.IDOSA;
        this.resetTable();
      }
    }
    this.incrementWinnerLabel();
  }

  incrementWinnerLabel() {
    switch (this.winner) {
      case TicTacToeSubjects.X:
        this.xLabel.string = `pontos x: ${this.xPoints}`;
        break;
      case TicTacToeSubjects.O:
        this.oLabel.string = `pontos o: ${this.oPoints}`;
        break;
      case TicTacToeSubjects.IDOSA:
        this.darOld();
        break;
    }
    this.winner = TicTacToeSubjects.NOT_OVERED;
  }

  darOld() {
    const nodeLabel = new cc.Node("LabelTop");
    nodeLabel.addComponent(cc.Label);
    nodeLabel.getComponent(cc.Label).string = "Kapa Kapa deu véia";
    this.oldAnchor.addChild(nodeLabel);
    setTimeout(() => {
      this.oldAnchor.removeAllChildren();
    }, 1000);
  }

  verifyIfAllButtonsAreFill(): boolean {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.getValueFromButton(this.buttons[i][j]) == "") {
          return false;
        }
      }
    }
    return true;
  }

  resetTable() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const label = this.getLabelFromButton(this.buttons[i][j]);
        label.string = "";
      }
    }
  }

  changeTurn() {
    if (this.turn == TicTacToeSubjects.X) {
      this.turn = TicTacToeSubjects.O;
    } else {
      this.turn = TicTacToeSubjects.X;
    }
  }

  start() {}

  // update (dt) {}
}

export enum TicTacToeSubjects {
  X = "X",
  O = "O",
  IDOSA = "IDOSA",
  NOT_OVERED = "NOT_OVERED",
}
