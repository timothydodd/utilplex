import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
  
      <main>
       <section>
            <p>Util Plex is a web-based platform designed to assist developers and coders by providing tools for formatting programming code and converting data formats.</p>
        </section>
        <section>
            <h2>Code Formatting Features</h2>
            <p>Our code formatter allows users to input unstructured or unformatted code into a text box and receive well-formatted, readable code in return. This feature supports multiple programming languages, including CSS, and adheres to best practices for code structure and readability.</p>
            <h3>How to Use:</h3>
            <ol>
                <li><strong>Select the Code Format:</strong> Choose the programming language or format for the code you are working with.</li>
                <li><strong>Input Your Code:</strong> Paste the code into the designated input box on the left side of the page.</li>
                <li><strong>Receive Formatted Code:</strong> Click the 'Format' button to process your code. The formatted code will appear in the output box on the right, ready for use.</li>
            </ol>
        </section>
        <section>
            <h2>Data Conversion Tools</h2>
            <p>Our platform also offers tools for converting data between different formats, such as JSON to YAML, and a time zone converter for managing times across different geographic locations. These tools are designed to simplify data management tasks and improve workflow efficiency.</p>
            <ul>
                <li><strong>JSON to YAML Converter:</strong> Convert JSON files into YAML format for enhanced readability and compatibility with various applications.</li>
                <li><strong>Time Zone Converter:</strong> Easily convert times between different time zones to coordinate schedules and deadlines across global teams.</li>
            </ul>
        </section>
        <section>
            <h2>About Util Plex</h2>
            <p>Util Plex aims to support the development community by providing a reliable, user-friendly platform for code formatting and data conversion. Whether you are a professional developer or a beginner, our tools are designed to enhance your productivity and improve the quality of your work.</p>
        </section>
    </main>

  
  `,
  styleUrl: './welcome.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent { }
