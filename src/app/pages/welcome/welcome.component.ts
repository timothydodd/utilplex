import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-welcome',
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
        <p>Our Code Formatter instantly enhances the structure and readability of your code as you type. It supports multiple programming languages, allowing for the input of unstructured or poorly formatted code and transforming it into a well-structured, readable format. This tool adheres to best practices for code structure and readability across the supported languages.</p>

        <h3>Supported Languages</h3>
        <ul>
            <li>CSS</li>
            <li>JavaScript</li>
            <li>JSON</li>
            <li>SQL</li>
        </ul>

        <h3>How to Use</h3>
        <ol>
            <li>
                <strong>Select the Code Format</strong>
                <p>First, select the programming language or format of your code from the available options. This ensures that the formatting rules applied are appropriate for the type of code you're working with.</p>
            </li>
            <li>
                <strong>Input Your Code</strong>
                <p>Begin typing or paste your code into the designated input box. The formatter will automatically start processing your input, applying the necessary formatting rules as you go.</p>
            </li>
            <li>
                <strong>View Formatted Code</strong>
                <p>As you input your code, watch it transform in real-time. The output box will display the formatted code, which is ready for use or further editing immediately.</p>
            </li>
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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent { }
