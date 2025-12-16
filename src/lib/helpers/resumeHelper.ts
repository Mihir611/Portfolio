import type { Writable } from 'svelte/store';

export async function summarizeResume(history: Writable<any>, play: (sound: string) => void) {
    try {
        const pdfjsLib = await import('pdfjs-dist/build/pdf');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfWorker/pdf.worker.mjs';
        const url = '/resume/Mihir_Udupa_Resume.pdf';
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item: any) => item.str);
            fullText += strings.join(' ') + '\n';
        }

        const extractSection = (keywords: string[], maxChars = 200) => {
            for (const kw of keywords) {
                const idx = fullText.toLowerCase().indexOf(kw.toLowerCase());
                if (idx >= 0) return fullText.slice(idx, idx + maxChars).replace(/\n/g, ' ').trim();
            }
            return '';
        }

        const summaryLines = [
            `📄 Resume Summary for Mihir Gurudas Udupa`,
            `----------------------------------------`,
            `👨‍💻 Experience: ${extractSection(['experience', 'work', 'employment'])}`,
            `🎓 Education: ${extractSection(['education', 'degree', 'university', 'college'])}`,
            `🛠 Skills: ${extractSection(['skills', 'technologies'])}`,
            `📁 Projects: ${extractSection(['projects', 'project'])}`,
            `📜 Certifications: ${extractSection(['certifications', 'certificate'])}`,
            `🌟 Interests: ${extractSection(['interests', 'hobbies'])}`,
            `----------------------------------------`,
            `Tip: Type 'coverletter' to download a pre-filled cover letter.`,
            `Tip: Use 'ls', 'cat', 'whoami' to explore more info.`
        ];

        for (const line of summaryLines) {
            history.update(h => [...h, { type: 'output', text: '' }]);
            const index = historyLength(history);
            await typeReveal(line, chunk => {
                history.update(h => { h[index] = { type: 'output', text: chunk }; return [...h]; });
            });
            play('info');
        }

    } catch (err) {
        console.error(err);
        history.update(h => [...h, { type: 'output', text: '❌ Failed to read resume PDF.' }]);
        play('error');
    }
}

function historyLength(history: Writable<any>) {
    let len = 0;
    history.subscribe(h => len = h.length)();
    return len;
}

// Typing animation helper
export async function typeReveal(text: string, update: (chunk: string) => void, speed = 6) {
    let buffer = '';
    for (const char of text) { buffer += char; update(buffer); await new Promise(r => setTimeout(r, speed)); }
}

// Download coverletter
export function downloadCoverLetter() {
    const link = document.createElement('a');
    link.href = '/resume/coverLetter.pdf';
    link.download = 'Mihir_Udupa_Cover_Letter.pdf';
    link.click();
}
