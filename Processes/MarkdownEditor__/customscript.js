Controls.Markdown__.OnChange = function()
{
	var control = this;
	var markownPreview = control.GetValue();
	var firstLine = markownPreview.split('\n')[0];
	
	if (firstLine)
	{
		if (firstLine.indexOf("#") === 0)
		{
			firstLine = firstLine.substr(1);
		}
		Controls.Title__.SetValue(firstLine.trim());
	}
	
	sessionStorage["markownPreview"] = markownPreview;
};

// Load initial content
sessionStorage["markownPreview"] = "";
sessionStorage["markownPreview"] = Controls.Markdown__.GetText();

if (!Controls.Markdown__.GetText())
{
	var today = new Date();
	var firstLine = "Untitled - " + today.toLocaleString();
	Controls.Title__.SetValue(firstLine);
	Controls.Markdown__.SetText("# " + firstLine);
	sessionStorage["markownPreview"] = Controls.Markdown__.GetText();
}