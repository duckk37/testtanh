import PyPDF2

pdf_files = [
    "bai ktra/1 2 DA.pdf",
    "bai ktra/2 DA.pdf",
    "bai ktra/3 DA.pdf",
    "bai ktra/4 da.pdf"
]

for pdf_file in pdf_files:
    print(f"--- {pdf_file} ---")
    try:
        with open(pdf_file, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            text = reader.pages[0].extract_text()
            print(text[:500] if text else "No text found")
    except Exception as e:
        print(f"Error: {e}")
    print("\n")
