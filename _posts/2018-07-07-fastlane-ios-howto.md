---
title:  "Publish to App Store with fastlane"
date:   2018-07-07 01:00:00 +0200
category: ios
preview_icon: categories/code.png
banner: /assets/banners/fastlane.jpg
comments: true
---

Three years ago at the [Pragma Conference](http://2015.pragmaconference.com/) in Florence, Italy, I heard about a tool to help streamline iOS app development and publishing to the App Store: [fastlane.tools](https://fastlane.tools/). It is only recently I decided to give it a closer look. And it is great, really great and really simplify releasing apps to Apple and Google app stores.

<!-- more -->

Automation. One word I'm always after when it comes to software development. Having to do the same tedious tasks twice is painful and developers want to avoid this, I want to avoid this.

In one of my previous jobs, we used to have a set of batch files here and there to deliver the product. It was a small startup, and one developer had this magic script to build the Java archive and then this JAR file could be sent to clients. I converted the batch file to [Ant](https://ant.apache.org/) (_this was in the early 2000s_), from compilation to the generation of installers. And then because it did not make sense to expect one single developer to be in charge of running a script, [CruiseControl](http://cruisecontrol.sourceforge.net/), a CI/CD platform, was added into the fix. Everything was automated, build, documentation, tests, installers.

Since that time, I chase these _automatable_ tasks and whenever I get a chance, just write the script that will save me precious time that can be spent on more valuable tasks.

These days I have an idea for an app and I started working on it. Few years ago I published an app to the App Store. Everything was done manually, building the app from XCode, capturing screenshots from the simulator, formatting the screenshots, updating the app description in all languages from the iTunes Connect website, uploading the build, submitting for review. A lot of pain and error prone. So this is a very good opportunity to try out **fastlane**.

> fastlane is an open source platform aimed at simplifying Android and iOS deployment.
> fastlane lets you automate every aspect of your development and release workflow.

fastlane includes several tools to achieve its goal: match, pilot, deliver to name of few, together with a set of plugins - like one to generate icons for all device sizes from one large PNG image. What I really missed was a step-by-step guide to integrate everything. It is not difficult but you have to read from several web pages to get to a point where you can start working on your app and not worry anymore about how to deliver your release. Going through the process, I captured all my steps and here they are.