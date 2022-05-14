# TodoMVC App Written in Vanilla JS in 2022

Seems it is pretty simple to build fairly complex things these days in modern JavaScript. We can take advantage of most features without crazy hacks. 

Here's my Vanilla JavaScript implementation – initial version took 60 minutes total to write (see first commit)

- 167 lines of code total (compared to the official vanilla JS TodoMVC from 6 years ago was 900+ LOC)
- No build tools
- JavaScript modules
- Initial implementation done in an hour, then cleaned it up with ~30 min of refactoring

[View the working example on GitHub pages](https://1marc.github.io/todomvc-vanillajs-2022/)

Related poll: "Would you build a large web app in 2022 with Vanilla JS?" https://twitter.com/1Marc/status/1520146662924206082

Criticism, PRs and feedback welcome!

# Additional Examples

## Memory Optimization: Event Delegation

Branch: https://github.com/1Marc/todomvc-vanillajs-2022/tree/event-delgation

People were concerned about the performance of re-rendering while binding events directly to new elements, so here's a branch of the same code but using [event delegation](https://github.com/1Marc/todomvc-vanillajs-2022/blob/event-delgation/js/app.js#L51-L78). 

This branch binds the events to the higher level list element which is persistent and looks up which todo was clicked using a data attribute.

## Scalability: Application Architecture

Branch: https://github.com/1Marc/todomvc-vanillajs-2022/tree/app-architecture

Then people were concerned about scalabillty of apps like this since there's no components and it's all one App. So I built on the event delegation branch and extracted the TodoList and App component and wired the components together.

## License

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by/4.0/80x15.png" /></a><br />This <span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/InteractiveResource" rel="dct:type">work</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://sindresorhus.com" property="cc:attributionName" rel="cc:attributionURL">TasteJS</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/deed.en_US">Creative Commons Attribution 4.0 International License</a>.
