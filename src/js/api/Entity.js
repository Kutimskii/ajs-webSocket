import createRequest from "./createRequest";
export default class Entity {
  create(userName, callback) {
    const res = createRequest({
      url: "https://websocketbackend.onrender.com" + "/new-user",
      params: {
        method: "POST",
        body: JSON.stringify({
          name: userName,
        }),
      },
    });
    res.then((response) => {
      if (response.status === "ok") {
        callback(response);
        return;
      }
      document.querySelector(".modal__container").style.display = "inherit";
      document.querySelector(".modal__content").classList.add("active");
      document.querySelector(
        ".modal__header"
      ).textContent = `${response.message}`;
    });
  }
  update() {}

  delete() {}
}
