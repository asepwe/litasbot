
# 🚀 Litas Auto Claim and Start Mining

![banner](image.png)

Welcome to **LitasBot**, your ultimate tool for automating mining on Litas! Whether you’re managing multiple accounts or using proxies, this bot has you covered. 🎉

---

## 🌟 Features

- ✅ **Auto Start & Claim Mining**
- ✅ **Support for Multiple Accounts**
- ✅ **Proxy Integration for Enhanced Privacy**

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following:

1. **Node.js** installed on your machine.
2. A `tokens.txt` file with your token and refresh token. Follow these steps to get them:

   - Open the Litas dashboard: [Litas Dashboard](https://wallet.litas.io/invite/hardeeps647) 🌐
   - Log in with your email.
   - Open your browser's developer tools (press `F12`) and navigate to the **Application** tab.
   - In **Local Storage**, find `token` and `refreshToken`. Copy both values.  
     ![Token Example](image-1.png)

---

## 📦 Installation

1. Clone this repository:  
   ```bash
   git clone https://github.com/hardeeps647/litasBot.git
   cd litasBot
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Add your tokens to the `tokens.txt` file. Use the format:  `token|refreshToken`
   ```
   nano tokens.txt
   ```

4. (Optional) Add proxy details to `proxy.txt` for enhanced privacy. Use the format:  
   ```
   http://username:password@ip:port
   ```
   Example:  
   ```bash
   nano proxy.txt
   ```

5. Start the bot:  
   ```bash
   npm run start
   ```

---

## 🔐 License

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)  
This project is licensed under the [MIT License](LICENSE).

---

Feel free to contribute, open issues, or suggest improvements. Happy mining! 💎
