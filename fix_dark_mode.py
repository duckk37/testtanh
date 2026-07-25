import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define replacements
    replacements = [
        (r'\bbg-slate-50(?! dark:)', r'bg-slate-50 dark:bg-slate-900'),
        (r'\bbg-white(?! dark:)', r'bg-white dark:bg-slate-800'),
        (r'\btext-slate-700(?! dark:)', r'text-slate-700 dark:text-slate-200'),
        (r'\btext-slate-900(?! dark:)', r'text-slate-900 dark:text-slate-100'),
        (r'\btext-slate-600(?! dark:)', r'text-slate-600 dark:text-slate-300'),
        (r'\btext-slate-500(?! dark:)', r'text-slate-500 dark:text-slate-400'),
        (r'\bborder-slate-200(?! dark:)', r'border-slate-200 dark:border-slate-700'),
        (r'\bborder-slate-100(?! dark:)', r'border-slate-100 dark:border-slate-700/50'),
        (r'\bborder-slate-50(?! dark:)', r'border-slate-50 dark:border-slate-800'),
        (r'\bshadow-soft(?! dark:)', r'shadow-soft dark:shadow-none'),
    ]

    new_content = content
    for pattern, repl in replacements:
        new_content = re.sub(pattern, repl, new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith('.jsx'):
            process_file(os.path.join(root, file))
