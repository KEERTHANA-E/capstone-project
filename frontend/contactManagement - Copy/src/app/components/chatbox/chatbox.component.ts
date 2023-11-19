import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent {
  messages: any[] = [];
  history = '';
  PREDEFINED_RESPONSES = [
    {
      question: 'Hi',
      response: 'Hello there!'
    },
    {
      question: 'How are you?',
      response: 'I am doing well, thank you for asking.'
    },
    {
      question: 'What time is it?',
      response: `I'm sorry, I cannot tell time.`
    },
    {
      question: "How do I search and filter for a specific contact within the application?",
      response: "To search for a specific contact, simply enter their identifying information in the search box and select the type of filter located in the top right corner of the contact list. The results will display in real-time as you type."
    },
    {
      question: "How can I categorize my contacts by role?",
      response: "You can categorize your contacts by role by using the dropdown list provided in the 'Contacts' feature within the application. Simply select the contact that you want to categorize, then select the appropriate role from the dropdown list. You can define custom roles within the application as well."
    },
    {
      question: "How can I see my activities in the application?",
      response: "You can see your activities in the application by navigating to the 'History' feature. This feature displays a list of all your recent activities within the application, such as logging in, updating your profile, or adding attachments to contact records."
    },
   
    {
      question: "Is there a limit to the number of contacts that can be stored in the application?",
      response: "No, there is no limit to the number of contacts that can be stored in the application. You can store as many contacts as you need without any additional fees."
    },
    {
      question: "How can I create users in bulk?",
      response: "You can create users in bulk by importing a CSV file that contains the user data. Navigate to the 'Import' feature and select the CSV file you want to upload. Make sure that the CSV file format matches the template provided by the application."
    },
    {
      question: "How can I export my contacts list?",
      response: "You can export your contacts list by selecting the 'Export' feature within the application. Choose the file format you wish to export your contacts list to; In this case, select xlsx. Based on which one you select, specify the fields you want to export or select all. Click on 'Export' and the app will create an xlsx file that contains all the contact details."
    },
  ];

  @ViewChild('input') input!: ElementRef;
  handleSubmit(): void {
    const query: string = this.input.nativeElement.value.trim().toLowerCase(); // convert query to lowercase
    const response = this.PREDEFINED_RESPONSES.find((item) => item.question.toLowerCase() === query); // convert the question to lowercase and compare
    if (response) {
      this.history += `You: ${query}\nChatbot: ${response.response}\n`;
      this.input.nativeElement.value = '';
    } else {
      this.history += `You: ${query}\nChatbot: I'm sorry, I don't understand.\n`;
    }
  }
  show = false;
  showImg = true;
  activated() {
    this.show = true;
    this.showImg = false;
  }
  deactivated() {
    this.show = false;
    this.showImg = true;
  }
}
