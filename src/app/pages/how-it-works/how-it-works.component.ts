import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouteService } from 'src/app/_services/route.service';

@Component({
  selector: 'app-how-it-works',
  imports: [CommonModule],
  host: { class: 'host-flex-container' },
  template: `
    <div class="tool-container">
      <div class="tool-header secondary-gradient">
        <div class="tool-info">
          <h1 class="tool-title secondary-gradient">How It Works</h1>
          <p class="tool-description">Everything runs in your browser. Your data never leaves your device.</p>
        </div>
      </div>

      <section class="content">
        <div class="section-card highlight-card">
          <h2 class="section-heading">Your data stays with you</h2>
          <p>
            Every tool on UtilPlex runs entirely inside your web browser. When you paste code to format,
            convert data between formats, or generate a GUID, all of that processing happens right on your
            machine. Nothing is sent to a server. There's no API call, no upload, no logging of what you
            type. Your data stays in the browser tab and goes nowhere else.
          </p>
          <p>
            This means you can safely use UtilPlex with production configs, API keys in JSON, SQL queries
            that touch real table names, or anything else you wouldn't want leaving your laptop. Close the
            tab and it's gone.
          </p>
        </div>

        <div class="section-card">
          <h2 class="section-heading">No accounts, no tracking, no ads</h2>
          <p>
            There are no user accounts, no cookies storing personal information, and no advertising.
            UtilPlex is free to use with no strings attached. We use basic anonymous analytics
            to understand which tools are popular so we can prioritize improvements, but we never
            track what you type or paste into any tool.
          </p>
        </div>

        <div class="section-card">
          <h2 class="section-heading">How the tools work under the hood</h2>
          <div class="detail-list">
            <div class="detail-item">
              <h3>Formatters</h3>
              <p>
                The SQL, JSON, CSS, JavaScript, TypeScript, SCSS, and HTML formatters use
                <strong>Prettier</strong> and <strong>sql-formatter</strong> — the same libraries
                developers use locally in their editors. They run as JavaScript inside your browser
                with no server round-trip.
              </p>
            </div>
            <div class="detail-item">
              <h3>Converters</h3>
              <p>
                JSON-to-YAML and YAML-to-JSON conversion uses the <strong>js-yaml</strong> library
                to parse and serialize directly in the browser. Case transformations (camelCase,
                snake_case, etc.) are handled with straightforward string manipulation — no external
                service needed.
              </p>
            </div>
            <div class="detail-item">
              <h3>Encoding</h3>
              <p>
                Base64 encoding and decoding uses the browser's built-in <code>btoa</code> and
                <code>atob</code> functions with support for different character encodings.
                It's as fast as it gets — native browser APIs, zero network overhead.
              </p>
            </div>
            <div class="detail-item">
              <h3>Generators</h3>
              <p>
                GUIDs are generated using <code>crypto.randomUUID()</code> or a cryptographically
                secure fallback, all within the browser. Lorem Ipsum text is assembled from a
                built-in word list — no internet connection required.
              </p>
            </div>
            <div class="detail-item">
              <h3>Text analysis</h3>
              <p>
                The String Measure tool counts characters, words, sentences, and more by running
                simple string operations on your input in real time. Results update as you type
                with zero delay — there's nothing to send or wait for.
              </p>
            </div>
            <div class="detail-item">
              <h3>Diff comparison</h3>
              <p>
                File comparison uses <strong>CodeMirror's</strong> built-in diff engine to compute
                and display differences between two text inputs. The entire diff algorithm runs
                in your browser tab.
              </p>
            </div>
          </div>
        </div>

        <div class="section-card">
          <h2 class="section-heading">Built with</h2>
          <div class="tech-grid">
            <div class="tech-item">
              <strong>Angular</strong>
              <span>Application framework</span>
            </div>
            <div class="tech-item">
              <strong>CodeMirror</strong>
              <span>Code editor with syntax highlighting</span>
            </div>
            <div class="tech-item">
              <strong>Prettier</strong>
              <span>Code formatting engine</span>
            </div>
            <div class="tech-item">
              <strong>sql-formatter</strong>
              <span>SQL query formatting</span>
            </div>
            <div class="tech-item">
              <strong>js-yaml</strong>
              <span>YAML parsing and serialization</span>
            </div>
          </div>
        </div>

        <div class="section-card">
          <h2 class="section-heading">Open source</h2>
          <p>
            UtilPlex is open source. You can read the code, report issues, or contribute on
            <a href="https://github.com/timothydodd/utilplex" class="ext-link" target="_blank" rel="noopener">GitHub</a>.
            If you spot something that could be better, pull requests are welcome.
          </p>
        </div>
      </section>
    </div>
  `,
  styleUrl: './how-it-works.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksComponent {
  private meta = inject(Meta);
  private titleService = inject(Title);
  router = inject(Router);

  constructor() {
    this.titleService.setTitle('UtilPlex | How It Works');
    this.meta.updateTag({
      name: 'description',
      content:
        'Learn how UtilPlex developer tools work entirely in your browser with no server-side processing. Your data never leaves your device.',
    });
    RouteService.Title.set('How It Works');
  }
}
