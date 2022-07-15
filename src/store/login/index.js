const state = {};

const loginStore = {
  //state
  state: () => ({
    isRequest: false,
    isSuccess: false,
    responceText: "",
    username: "",
    password: ""
  }),
  //thay đổi state
  mutations: {
    requesting(state, data) {
      console.log("requesting", data);
      state.isRequest = data.data;
    },
    successLogin(state) {
      console.log("successLogin");
      state.isSuccess = true;
    },
    failedLogin(state) {
      console.log("failedLogin");
      state.responceText = "Đăng nhập lỗi";
    }
  },

  getters: {
    //dùng để tính toán thao tác trên mảng state
  },
  //action để gọi các mutations - gần giống action bên redux - reacjs
  actions: {
    login1({ commit }, data) {
      console.log(data.username, data.password);
      //update trạng thái login là true
      //action sẽ chạy 1 mutations tên là request
      commit("requesting", { data: true });
      //gọi api bằng service request
      setTimeout(() => {
        commit("successLogin");
      }, 3000);

      //nếu thành công sẽ gọi mutation successLogin
      setTimeout(() => {
        commit("failedLogin", { data: false });
      }, 2000);
      //nếu thất bại sẽ gọi mutation failedLogin
    },
    forgetPasword({ commit }, username, password) {}
  }
};

export default loginStore;
