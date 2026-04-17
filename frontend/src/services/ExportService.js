import React from 'react';

const ExportService = {
  downloadMarkdown: (session, summaries, actionItems, concepts) => {
    let content = `# DeepDive AI Analysis: ${session?.title || 'Session'}\n\n`;
    
    content += `## Summaries\n`;
    Object.entries(summaries).forEach(([mode, text]) => {
      content += `### ${mode}\n${text}\n\n`;
    });
    
    content += `## Action Items\n`;
    actionItems.forEach(item => {
      content += `- [ ] (${item.type.toUpperCase()}) ${item.content} ${item.assignee ? `[@${item.assignee}]` : ''}\n`;
    });
    
    content += `\n## Key Concepts\n`;
    concepts.forEach(con => {
      content += `### ${con.name}\n${con.description}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session?.title || 'analysis'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }
};

export default ExportService;
