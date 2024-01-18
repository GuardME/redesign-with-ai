function forceDownload(blobUrl, filename) {
    let a = document.createElement("a");
    a.download = filename;
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    a.remove();
}
export default function dwonloadPhoto(url, filename) {
    fetch(url, {
        headers: new Headers({
            Origin: location.origin,
        }),
        mode: "cors"
    })
    .then((res) => res.blob())
    .then((blob) => {
        let blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, filename);
    })
    .catch((e) => console.log(e));
}