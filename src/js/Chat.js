import ChatAPI from "./api/ChatAPI";

export default class Chat {
  constructor(container) {
    this.container = container;
    this.api = new ChatAPI();
    this.websocket = null;
    this.chat = this.container.querySelector(".chat__container");
  }

  init() {
    this.subscribeOnEvents();
  }

  registerEvents() {
    this.ws = new WebSocket("wss://websocketbackend.onrender.com/ws");
    this.ws.addEventListener("open", (e) => {
      console.log(e);
      console.log("ws open");
    });

    this.ws.addEventListener("close", (e) => {
      console.log(e);
      console.log("ws close");
    });

    this.ws.addEventListener("error", (e) => {
      console.log(e);
      console.log("ws error");
    });

    this.ws.addEventListener("message", (e) => {
      let data = JSON.parse(e.data);
      if (data.type === "send") {
        const date = new Date();
        const msg = document.createElement("div");
        msg.classList.add("chat__msg");
        msg.insertAdjacentHTML(
          "afterbegin",
          `
        <p class="msg__info"><span class="msg__user__name">${
          data.user.name
        },</span> <span class="msg__time">
        ${date.toLocaleTimeString()}</span> <span class="msg__date">${date.toLocaleDateString()}</span></p>
        <p class="msg__text">${data.message}</p>`
        );
        if (data.user.name === this.userName) {
          msg.classList.add("this__user");
          msg.querySelector(".msg__user__name").textContent = "You";
        }
        this.chat
          .querySelector(".chat__window")
          .insertAdjacentElement("beforeend", msg);
        return;
      }
      this.renderUsers(data);
    });
  }

  subscribeOnEvents() {
    this.container
      .querySelector(".btn_contiune")
      .addEventListener("click", (e) => {
        e.preventDefault();
        this.container.querySelector(".modal__container").style.display =
          "none";
        this.container
          .querySelector(".modal__content")
          .classList.remove("active");
        this.userName = this.container.querySelector(".form__input").value;
        this.api.create(this.userName, (res) => {
          const list = document.createElement("li");
          list.dataset.id = res.user.id;
          this.userId = res.user.id;
          list.dataset.name = res.user.name;
          list.textContent = res.user.name;
          list.classList.add("chat__user");
          document.querySelector(".chat__users").appendChild(list);
          this.registerEvents();
        });
        this.container
          .querySelector(".input__chat__message")
          .addEventListener("keyup", (e) => {
            if (e.keyCode === 13) {
              this.sendMessage();
            }
          });
      });
    window.addEventListener("unload", () => {
      const data = {
        type: "exit",
        message: null,
        user: {
          id: this.userId,
          name: this.userName,
        },
      };
      this.ws.send(JSON.stringify(data));
    });
  }

  sendMessage() {
    const data = {
      type: "send",
      message: this.container.querySelector(".input__chat__message").value,
      user: {
        name: this.userName,
      },
    };
    this.ws.send(JSON.stringify(data));
    this.container.querySelector(".input__chat__message").value = "";
  }

  renderUsers(data) {
    document.querySelector(".chat__users").innerHTML = "";
    data.forEach((element) => {
      const list = document.createElement("li");
      list.dataset.id = element.id;
      list.dataset.name = element.name;
      list.textContent = element.name;
      list.classList.add("chat__user");
      if (element.name === this.userName) {
        list.classList.add("this__user");
        list.textContent = "You";
      }
      document.querySelector(".chat__users").appendChild(list);
    });
  }
}
