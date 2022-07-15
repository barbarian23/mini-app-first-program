<template>
  <div>
    <h2>Login Form</h2>

    <div class="form">
      <div class="imgcontainer">
        <img src="img_avatar2.png" alt="Avatar" class="avatar" />
      </div>

      <div class="container">
        <label for="uname"><b>Username</b></label>
        <input
          type="text"
          placeholder="Enter Username"
          name="uname"
          required
          v-model="username"
        />

        <label for="psw"><b>Password</b></label>
        <input
          type="password"
          placeholder="Enter Password"
          name="psw"
          required
          v-model="password"
        />
        <div v-if="requesting" class="loginin">Logining</div>
        <div v-else>
          <button type="submit" v-on:click="login">Login</button>
          <label>
            <input
              type="checkbox"
              checked="checked"
              name="remember"
              v-model="rememberMe"
            />
            Remember me
          </label>
        </div>
      </div>

      <div class="container" style="background-color: #f1f1f1">
        <button type="button" class="cancelbtn">Cancel</button>
        <span class="psw">Forgot <a href="#">password?</a></span>
      </div>
      <div>{{ responceTextLogin }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
//để dùng action trong vuex

export default {
  //useRef
  setup() {
    // const divRef = ref(null);
    // onMounted(() => {
    //   console.log("div: ", divRef.value);
    // });
    // onMounted(() => {
    //   console.log(`This will only run after initial render.`);
    // });
    // onBeforeUnmount(() => {
    //   console.log(`This will only run when component will unmount.`);
    // });
  },

  name: "login",
  //state
  data: () => {
    return {
      username: "",
      password: "",
      rememberMe: true,
    };
  },
  //các hàm tính toán, gọi api
  methods: {
    login() {
      console.log("username", this.username);
      console.log("password", this.password);
      console.log("rememberMe", this.rememberMe);
      uni.navigateTo({
        url: "../trade/main",
      });
      this.$store.dispatch("login1", {
        username: this.username,
        password: this.password,
      });
    },
  },
  //thay đổi state
  computed: {
    //logining
    requesting() {
      return this.$store.state.loginStore.isRequest;
    },
    isLoginSucess() {
      return this.$store.state.loginStore.isSuccess;
    },
    responceTextLogin() {
      return this.$store.state.loginStore.responceText;
    },
  },
  //theo dõi porp, state thay đổi - componentwillupdate, useEffect với mảng phụ thuộc
  watch: {
    //theo dõi state của vuex bằng compute
    requesting(value) {
      console.log(
        `change 'isRequest' changed to ${value} while`,
        this.$store.state.loginStore.isRequest
      );
    },
    isLoginSucess(value) {
      if (value) {
        //navigate to Otp
        //this.$router.push({ name: "Otp" });
        // wx.switchTab({
        //   url: "pages/news/trade/main",
        // });
      }
    },
  },
};
</script>

<style scoped>
body {
  font-family: Arial, Helvetica, sans-serif;
}
.form {
  border: 3px solid #f1f1f1;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

button {
  background-color: #04aa6d;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
}

button:hover {
  opacity: 0.8;
}

.cancelbtn {
  width: auto;
  padding: 10px 18px;
  background-color: #f44336;
}

.imgcontainer {
  text-align: center;
  margin: 24px 0 12px 0;
}

img.avatar {
  width: 40%;
  border-radius: 50%;
}

.container {
  padding: 16px;
}

span.psw {
  float: right;
  padding-top: 16px;
}

/* Change styles for span and cancel button on extra small screens */
@media screen and (max-width: 300px) {
  span.psw {
    display: block;
    float: none;
  }
  .cancelbtn {
    width: 100%;
  }
}

@keyframes color {
  0% {
    color: red;
  }
  25% {
    color: yellow;
  }
  50% {
    color: blue;
  }
  75% {
    color: green;
  }
  100% {
    color: red;
  }
}

.loginin {
  animation-name: color;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}
</style>