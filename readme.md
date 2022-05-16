# TodoMVC App Written in Vanilla JS in 2022

Seems it is pretty simple to build fairly complex things these days in modern JavaScript. We can take advantage of most features without crazy hacks. 

Here's my Vanilla JavaScript implementation:

- 184 lines of code total (compared to the official vanilla JS TodoMVC from 6 years ago was 900+ LOC)
- No build tools
- JavaScript modules

[View the working example on GitHub pages](https://1marc.github.io/todomvc-vanillajs-2022/)

Related poll: "Would you build a large web app in 2022 with Vanilla JS?" https://twitter.com/1Marc/status/1520146662924206082

Criticism, PRs and feedback welcome!

# Additional Examples

## App Architecture

People were concerned about scalabillty of apps like this since there's no components and it's all one App. So I extracted the TodoList and App component and wired the components together on the app-architecture branch.

Branch: https://github.com/1Marc/todomvc-vanillajs-2022/tree/app-architecture

Note: I realize it is a bit ridiculous to say the word "scalable" in the context of a todo app, but this should more be looked at as a blueprint for building something bigger. I plan to make more ambitious examples in the future to show what's possible.

## Initial Version

This took only 60 minutes total to write, then ~30 min of refactoring: [see commit here](https://github.com/1Marc/todomvc-vanillajs-2022/tree/fb3c61ed104c440f0c29e3a074b6777c791aa2f6)

How it came together so quickly was what initially got me pumped about this.

## License

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by/4.0/80x15.png" /></a><br />This <span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/InteractiveResource" rel="dct:type">work</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://sindresorhus.com" property="cc:attributionName" rel="cc:attributionURL">TasteJS</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/deed.en_US">Creative Commons Attribution 4.0 International License</a>.
