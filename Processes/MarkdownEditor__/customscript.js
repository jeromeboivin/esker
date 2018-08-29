Controls.Save.OnClick = function()
{
	Controls.Markdown__.SetValue(sessionStorage["markdownPreview"] ? sessionStorage["markdownPreview"] : "");
	var markownPreview = Controls.Markdown__.GetValue();
	var firstLine = markownPreview.split('\n')[0];
	
	if (firstLine)
	{
		if (firstLine.indexOf("#") === 0)
		{
			firstLine = firstLine.substr(1);
		}
		Controls.Title__.SetValue(firstLine.trim());
	}
	
	sessionStorage.removeItem("markdownPreview");
};

Controls.Close.OnClick = function()
{
	sessionStorage.removeItem("markdownPreview");
};
	
// Load initial content
sessionStorage["markdownPreview"] = "";
sessionStorage["markdownPreview"]  = Controls.Markdown__.GetText();

if (!Controls.Markdown__.GetText())
{
	var today = new Date();
	var firstLine = "Untitled - " + today.toLocaleString();
	Controls.Title__.SetValue(firstLine);
	Controls.Markdown__.SetText("# " + firstLine);
	sessionStorage["markdownPreview"] = Controls.Markdown__.GetText();
}

Controls.Title__.Hide();
Controls.Markdown__.Hide();
