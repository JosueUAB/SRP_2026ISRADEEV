import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true
})
export class SafeUrlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(url: string | null | undefined): SafeUrl | string {
    if (!url) return '';
    
    let finalUrl = url.trim();

    // Si es un enlace de Google Drive, lo convertimos a Thumbnail
    if (finalUrl.includes('drive.google.com') && finalUrl.includes('id=')) {
      const match = finalUrl.match(/id=([^&]+)/);
      if (match && match[1]) {
         finalUrl = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
      }
    } else if (!finalUrl.startsWith('http') && !finalUrl.startsWith('data:image')) {
      // Si no es URL ni data URI, asumimos que es base64 en crudo (legacy)
      finalUrl = `data:image/jpeg;base64,${finalUrl}`;
    }

    // Bypass del sanitizer de Angular
    return this.sanitizer.bypassSecurityTrustUrl(finalUrl);
  }
}
