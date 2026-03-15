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
    
    // Si es un enlace de Google Drive, lo convertimos a Thumbnail para evitar bloqueos por CORS o Cookies
    // Ejemplo de URL base: https://drive.google.com/uc?export=view&id=1xCk...
    let finalUrl = url;
    if (url.includes('drive.google.com') && url.includes('id=')) {
      const match = url.match(/id=([^&]+)/);
      if (match && match[1]) {
         finalUrl = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
      }
    }

    // Bypass del sanitizer de Angular
    return this.sanitizer.bypassSecurityTrustUrl(finalUrl);
  }
}
