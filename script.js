const fileInput = document.getElementById('imageInput');
const formatSelect = document.getElementById('formatSelect');
const convertBtn = document.getElementById('convertBtn');
const downloadLink = document.getElementById('downloadLink');
const dropZone = document.getElementById('dropZone');
const fileInfo = document.getElementById('fileInfo');

let loadedImage = null;

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    alert('Please select a valid image file.');
    return;
  }

  fileInfo.textContent = `File loaded: ${file.name}`;

  const currentFormat = file.type;
  
  Array.from(formatSelect.options).forEach(option => {
    if (option.value === currentFormat) {
      option.disabled = true;
    } else {
      option.disabled = false;
    }
  });

  if (formatSelect.value === currentFormat) {
    const firstAvailable = Array.from(formatSelect.options).find(opt => !opt.disabled);
    if (firstAvailable) formatSelect.value = firstAvailable.value;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    loadedImage = new Image();
    loadedImage.onload = () => {
      convertBtn.disabled = false;
      downloadLink.style.display = 'none'; 

      dropZone.innerHTML = ''; 

      const previewImage = document.createElement('img');
      previewImage.src = e.target.result;   
      previewImage.classList.add('preview-img'); 

      const textHint = document.createElement('p');
      textHint.innerHTML = "Image loaded. <span class='browse-text'>Click here to change it</span>";
      textHint.style.marginTop = "10px";

      dropZone.appendChild(previewImage);
      dropZone.appendChild(textHint);
    };
    loadedImage.src = e.target.result;
  };
  reader.readAsDataURL(file);
}


dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFile(e.target.files[0]);
  }
});

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, (e) => e.preventDefault(), false);
});

['dragenter', 'dragover'].forEach(eventName => {
  dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
});

dropZone.addEventListener('drop', (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
});

convertBtn.addEventListener('click', () => {
  if (!loadedImage) return;

  const canvas = document.createElement('canvas');
  canvas.width = loadedImage.width;
  canvas.height = loadedImage.height;
  const ctx = canvas.getContext('2d');
  
  const selectedFormat = formatSelect.value;
  
  if (selectedFormat === 'image/jpeg' || selectedFormat === 'image/bmp') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(loadedImage, 0, 0);

  const convertedDataUrl = canvas.toDataURL(selectedFormat, 0.9);
  downloadLink.href = convertedDataUrl;
  
  let extension = selectedFormat.split('/')[1]; 
  
  if (extension === 'jpeg') {
    extension = 'jpg';
  }
  
  downloadLink.download = `imagen_convertida.${extension}`;
  
  downloadLink.style.display = 'block';
  downloadLink.textContent = `Download as .${extension.toUpperCase()}`;
});

