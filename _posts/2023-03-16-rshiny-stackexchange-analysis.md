---
layout: post
title: An Analysis of the Stack Exchange Network, Through an Interactive RShiny Web App
date: 2023-03-16 08:30:00
description: Stack Overflow is one of the most well-known websites for coders. It is a community-driven forum for asking and answering questions about coding, programming, software engineering, etc. The Stack Overflow website is just one community out of many, all of which are hosted by the Stack Exchange network.
thumbnail: assets/img/2023-03-16-rshiny-stackexchange-analysis/1.png
tags: data-visualization
categories: data-science
featured: false
---

Stack Overflow is one of the most well-known websites for coders. It is a community-driven forum for asking and answering questions about coding, programming, software engineering, etc. The [Stack Overflow](https://stackoverflow.com/) website is just one community out of many, all of which are hosted by the [Stack Exchange network](https://stackexchange.com/).

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-03-16-rshiny-stackexchange-analysis/1.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    StackOverflow logo. Source: StackOverflow.
</div>

I like browsing through numerous Stack Exchange websites to see the questions people are asking, and how community experts answer them. Some of my favorite Stack Exchange websites include [academia](https://academia.stackexchange.com/), [astronomy](https://astronomy.stackexchange.com/), [data science](https://datascience.stackexchange.com/), and more. Of course, this doesn’t include my all-time favorite, Stack Overflow, for when I get stuck on coding problems!

Naturally, as a data scientist, I wanted to analyze this data. I found so much data that I ended up making an RShiny app! Read on to learn more…

## The App
I used R to do the analysis, and display it interactively using the Shiny framework. The app reads in static datasets of 14 different Stack Exchange websites, and allows you, the user, to increase the number of displayed data points and fix a date range to filter posts by. All the code and data are hosted on [Github](https://github.com/awesomecosmos/Stack-Exchange-Analysis).

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-03-16-rshiny-stackexchange-analysis/2.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    StackExchange Explorer app. Screenshot provided by author.
</div>

There are two tabs, an Overall Analysis tab, and a Time Series Analysis tab. The first tab shows the top tag each year by frequency, the top 10 tags over time, and a histogram of the top 10 tags. The second tab shows the number of questions asked every day in the time range, and the average difference between the question creation date, and the dates they were last edited, last had activity, and last marked as closed. You can download each of these graphs for your own analysis!

## Case Study: Data Science Stack Exchange
Let’s do a case study! We’ll look at data from the Data Science Stack Exchange website. We’ll keep the default options. Now let’s see what we find!

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-03-16-rshiny-stackexchange-analysis/3.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

From 2014–2022, the top tag every year has consistently been Machine Learning! In 2014, there are about 200 posts tagged with *machine-learning*, but by 2016, there are more than 500 posts tagged with *machine-learning*! We see this tag sky-rockets after 2017 and peaks in 2018 with close to 1500 posts tagged, before gradually decreasing.

Why is there a decrease in the number of posts tagged with *machine-learning*? Let’s look at the next graph to see.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-03-16-rshiny-stackexchange-analysis/4.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

This graph shows the top 10 tags over time. The tag *machine-learning* dominates by a large margin, as the previous graph showed. It seems the second-most used tag is *python*, and then *deep-learning* after that. These tags also follow similar frequencies over time as *machine-learning*.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-03-16-rshiny-stackexchange-analysis/5.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

This histogram shows the all-time frequencies of tags. Unsurprisingly, *machine-learning* leads, followed by *python* and *deep-learning*, *neural-network* and *classification*. So it seems that data scientists on this Stack Exchange are primarily only concerned with machine learning and Python, in addition to deep learning and neural networks. There’s no mention of other popular data science tools and techniques, like R, SQL or artificial intelligence, interestingly!

So the last three graphs gave us insight into the popularity of tags on the forum, but what about community activity? As it turns out, the dataset contains data like CreationDate (date the question was created), LastActivityDate (date there was last any activity on the question, e.g. answers and comments), and ClosedDate (date the question was marked as ‘closed’). We can use these to get an idea of the community activity on the Data Science Stack Exchange over time.

The default filtering options set the time range from Jan 1 2021 to Dec 17 2022 (date the dataset was downloaded). In this time range, we find that there were a total of 6673 questions asked, out of which only 28 were closed! This amounts to only 0.42% of questions closed! We also see there is a general upward trend in questions closed, indicating that newer questions tend to get closed, compared to older ones.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-03-16-rshiny-stackexchange-analysis/6.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

In the same date range, we also see the average differences between question dates. The green line is the average difference between CreationDate and LastActivityDate, the blue line is the average difference between CreationDate and LastEditDate, and the red line is the average difference between CreationDate and ClosedDate.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-03-16-rshiny-stackexchange-analysis/7.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

For the average difference between CreationDate and LastActivityDate, we see that this difference is the lowest across all three categories, and has an average difference of 92 days over the time period, i.e. on average in this time period, the difference between a question’s creation and its last activity is 92 days, or about 3 months.

Comparing LastEditDate, we see the average difference is 215 days since a question’s creation, indicating that questions do not tend to be edited as often as they get activity on them.

The red line is the most interesting, and shows that the average difference between a question being asked and it being resolved is 381 days, or just above a year. In most cases, questions do not get closed, which is shown by the smooth boundary marker.

This case study gave us a little insight into the Data Science community on Stack Exchange, and what’s trending. Evidently, the community is most interested in machine learning and Python, and while the community is very active, oftentimes questions may not get completely resolved quickly.

For an introductory foray into this dataset, it sure yielded a lot of insight into trends in the Data Science field. Similarly, you can explore the app yourself and see what other communities are like, here: [https://awesomecosmos.shinyapps.io/stack-exchange-analysis/](https://awesomecosmos.shinyapps.io/stack-exchange-analysis/).

You can also explore the code repository on Github here: [https://github.com/awesomecosmos/Stack-Exchange-Analysis](https://github.com/awesomecosmos/Stack-Exchange-Analysis). Leave a star or fork the repository if you like it!