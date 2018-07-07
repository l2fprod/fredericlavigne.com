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

Since that time, I chase these _automatable_ tasks and whenever I get a chance, just write the script that will save us precious time that can be spent on more valuable tasks.

> fastlane is an open source platform aimed at simplifying Android and iOS deployment.
> fastlane lets you automate every aspect of your development and release workflow.
