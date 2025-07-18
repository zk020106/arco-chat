const fs = require('fs');
const path = require('path');
const { parse } = require('vue-docgen-api');

const componentsDir = path.resolve(__dirname, '../packages/core/src/components');
const outputDir = path.resolve(__dirname, 'components/api');

function findVueFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findVueFiles(filePath));
    } else if (file.endsWith('.vue')) {
      results.push(filePath);
    }
  });
  return results;
}

// 确保输出目录存在
fs.mkdirSync(outputDir, { recursive: true });

const vueFiles = findVueFiles(componentsDir);

vueFiles.forEach(async (file) => {
  const relativePath = path.relative(componentsDir, file);
  const fileName = relativePath.replace(/\\|\//g, '_').replace(/\.vue$/, '.md');
  const outputFile = path.join(outputDir, fileName);
  console.log(`Generating API for ${file} -> ${outputFile}`);
  try {
    const doc = await parse(file);
    const md = `# ${doc.displayName}\n\n${doc.description || ''}\n\n## Props\n\n` +
      (doc.props && doc.props.length
        ? doc.props.map(p => `- **${p.name}**: ${p.type?.name || ''}  \n  ${p.description || ''}  \n  _default_: ${p.defaultValue?.value || 'N/A'}\n`).join('\n')
        : '无') +
      '\n';
    fs.writeFileSync(outputFile, md, 'utf-8');
  } catch (e) {
    console.error(`Failed to generate for ${file}:`, e.message);
  }
}); 