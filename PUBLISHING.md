# Publishing checklist

## GitHub

Create a public repository, then from this directory run:

```bash
git remote add origin https://github.com/YOUR-USER/applicant-desk-autofill.git
git push -u origin main
git tag v0.1.0
git push origin v0.1.0
```

The `check.yml` workflow will verify the extension and upload a ZIP artifact. The `pages.yml` workflow will deploy the root static site. In repository Settings → Pages, choose **GitHub Actions** as the source the first time.

## Chrome Web Store

1. Register a Chrome Web Store developer account.
2. Upload the ZIP created by `./package-extension.sh`.
3. Use `STORE-LISTING.md` for the single-purpose description and permission justifications.
4. Link the published `privacy.html` page in the Privacy practices section.
5. Declare that the extension does not use remote code and handles data locally.

## Other distribution

- GitHub Pages: users open the Applicant Desk webpage directly.
- GitHub Release: attach `dist/applicant-desk-autofill-0.1.0.zip` for manual installation.
- Unpacked extension: developers can select the `extension/` folder at `chrome://extensions`.
