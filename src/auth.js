const { createApp } = Vue;

createApp({
  data() {
    return {
      isLogin: true, // true = show login, false = show register

      // login form data
      loginData: {
        username: '',
        password: ''
      },

      // register form data
      registerData: {
        username: '',
        email: '',
        password: ''
      }
    };
  },
  methods: {
    handleLogin() {
      alert(`Logging in as ${this.loginData.username}`);
      // Later, we’ll connect to backend or Firebase here
    },
    handleRegister() {
      alert(`Registered: ${this.registerData.username}`);
    }
  }
}).mount('#app');
