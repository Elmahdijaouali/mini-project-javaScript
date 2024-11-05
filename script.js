// get from send message prompt
let form = document.forms["form-send-message"];
let conatainerChatBot = document.querySelector(".container-chatbot");
let conatainerMessages = document.querySelector(".container-messages");
let userMessagePrompt = form[0];

// close chatBot
const closeChatBot = () => {
  conatainerChatBot.style.display = "none";
  document.querySelector(".btn-open-chatBot").style.display = "block";
};
// open chatBot
function openChatBot() {
  conatainerChatBot.style.display = "block";
  document.querySelector(".btn-open-chatBot").style.display = "none";
}

userMessagePrompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && userMessagePrompt.value.trim() != 0) {
    handleMessages();
  }
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleMessages();
});

// handle messages between user and botChat
const handleMessages = async () => {
  //  console.log(message.value)

  let userMessage = `
    <div class="user-message">
        <p>  ${userMessagePrompt.value}</p>
    </div>`;
  conatainerMessages.innerHTML += userMessage;

  //  add message waiting response
  let messageWaiting = `
 <div class="bot-message waiting-response">
     <i class="fa-solid fa-robot"></i> <p id="loading">...</p> 
 </div>`;

  setTimeout(() => {
    conatainerMessages.innerHTML += messageWaiting;
  }, 500);

  // Call the function to execute the request
  let res = await generateContent(userMessagePrompt.value);

  userMessagePrompt.value = "";
  let waitingResponse = document.querySelector(".waiting-response");
  if (res) {
    if (waitingResponse) {
      waitingResponse.remove();
    }

    let messageResponseAi = document.createElement("div");

    messageResponseAi.className = "bot-message";

    messageResponseAi.innerHTML = '<i class="fa-solid fa-robot"></i> ';

    let pBotChatMessage = document.createElement("p");

    const htmlResponse = marked.parse(res);

    pBotChatMessage.innerHTML = htmlResponse;

    messageResponseAi.appendChild(pBotChatMessage);

    conatainerMessages.appendChild(messageResponseAi);
  }

  conatainerMessages.scrollTop = conatainerMessages.scrollHeight;
};

//  fetch data from gemini api
const generateContent = async (prompt) => {
  // create key from google gemini and add on this apiKey
  const apiKey = "YOUR_KEY";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const requestData = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error generating content:", error);
  }
};
